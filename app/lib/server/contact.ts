import "server-only";
import { query, queryOne, execute } from "./db";

/** The states a lead moves through in the admin inbox. */
export const LEAD_STATUSES = ["new", "read", "replied", "archived"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface ContactLead {
  id: number;
  name: string;
  email: string;
  mobile: string;
  service: string;
  budget: string | null;
  message: string;
  status: LeadStatus;
  /** 0 when the notification email could not be sent — chase these. */
  email_sent: 0 | 1;
  /** Set when the lead was discarded. The row survives so it stays countable. */
  deleted_at: string | null;
  replied_at: string | null;
  reply_count: number;
  /** The first page of the visit that produced this enquiry. */
  landing_page: string | null;
  referrer: string | null;
  /** Short label worked out from the referrer: google, facebook, direct… */
  source: string | null;
  created_at: string;
}

export interface LeadReply {
  id: number;
  message_id: number;
  body: string;
  email_sent: 0 | 1;
  error: string | null;
  created_at: string;
}

export interface LeadCounts {
  total: number;
  unread: number;
  undelivered: number;
  deleted: number;
}

const FIELDS = `
  id, name, email, mobile, service, budget, message, status,
  email_sent, deleted_at, replied_at, reply_count,
  landing_page, referrer, source, created_at
`;

/**
 * Turns a referrer URL into something you can group by.
 *
 * Search engines and the big social sites get their own label; anything else
 * becomes the bare hostname, which is more useful than "other" when a
 * directory or a partner site starts sending work.
 */
export function sourceFromReferrer(referrer?: string | null): string {
  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "other";
  }

  if (host.includes("google.")) return "google";
  if (host.includes("bing.")) return "bing";
  if (host.includes("duckduckgo.")) return "duckduckgo";
  if (host.includes("yahoo.")) return "yahoo";
  if (host.includes("facebook.") || host === "fb.com" || host.includes("fb.me"))
    return "facebook";
  if (host.includes("instagram.")) return "instagram";
  if (host.includes("linkedin.") || host === "lnkd.in") return "linkedin";
  if (host.includes("youtube.") || host === "youtu.be") return "youtube";
  if (host.includes("whatsapp.") || host === "wa.me") return "whatsapp";
  if (host === "t.co" || host.includes("twitter.") || host === "x.com")
    return "twitter";

  return host.slice(0, 40);
}

export async function saveLead(data: {
  name: string;
  email: string;
  mobile: string;
  service: string;
  budget?: string;
  message: string;
  landingPage?: string | null;
  referrer?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<number> {
  const result = await execute(
    `INSERT INTO contact_messages
       (name, email, mobile, service, budget, message,
        landing_page, referrer, source, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.email,
      data.mobile,
      data.service,
      data.budget || null,
      data.message,
      data.landingPage?.slice(0, 255) || null,
      data.referrer?.slice(0, 400) || null,
      sourceFromReferrer(data.referrer),
      data.ip || null,
      data.userAgent?.slice(0, 400) || null,
    ],
  );
  return result.insertId;
}

export async function markEmailSent(id: number): Promise<void> {
  await execute("UPDATE contact_messages SET email_sent = 1 WHERE id = ?", [id]);
}

/**
 * @param includeDeleted true returns ONLY discarded leads, so the inbox can
 * show them under their own filter instead of mixing them into the live list.
 */
export async function listLeads(
  limit = 50,
  includeDeleted = false,
): Promise<ContactLead[]> {
  // LIMIT is inlined because MySQL will not take it as a placeholder in a
  // prepared statement. `capped` is an integer we produced, never user text.
  const capped = Math.min(Math.max(1, limit), 200);
  return query<ContactLead>(
    `SELECT ${FIELDS}
       FROM contact_messages
      WHERE deleted_at IS ${includeDeleted ? "NOT NULL" : "NULL"}
      ORDER BY created_at DESC
      LIMIT ${capped}`,
  );
}

export async function findLead(id: number): Promise<ContactLead | null> {
  return queryOne<ContactLead>(
    `SELECT ${FIELDS} FROM contact_messages WHERE id = ? LIMIT 1`,
    [id],
  );
}

export async function leadCounts(): Promise<LeadCounts> {
  const row = await queryOne<{
    total: number;
    unread: number | null;
    undelivered: number | null;
    deleted: number | null;
  }>(
    `SELECT
       SUM(deleted_at IS NULL) AS total,
       SUM(deleted_at IS NULL AND status = 'new') AS unread,
       SUM(deleted_at IS NULL AND email_sent = 0) AS undelivered,
       SUM(deleted_at IS NOT NULL) AS deleted
     FROM contact_messages`,
  );

  return {
    total: Number(row?.total || 0),
    unread: Number(row?.unread || 0),
    undelivered: Number(row?.undelivered || 0),
    deleted: Number(row?.deleted || 0),
  };
}

export async function setLeadStatus(
  id: number,
  status: LeadStatus,
): Promise<boolean> {
  const result = await execute(
    "UPDATE contact_messages SET status = ? WHERE id = ?",
    [status, id],
  );
  return result.affectedRows > 0;
}

/* ------------------------------- replies -------------------------------- */

export async function listReplies(messageId: number): Promise<LeadReply[]> {
  return query<LeadReply>(
    `SELECT id, message_id, body, email_sent, error, created_at
       FROM contact_replies
      WHERE message_id = ?
      ORDER BY created_at ASC`,
    [messageId],
  );
}

/**
 * Records a reply whether or not the email went out.
 *
 * A failed send is still written down, with the error, so the reply text is
 * never lost and you can see which ones need sending again by hand.
 */
export async function saveReply(
  messageId: number,
  body: string,
  emailSent: boolean,
  error?: string | null,
): Promise<number> {
  const result = await execute(
    "INSERT INTO contact_replies (message_id, body, email_sent, error) VALUES (?, ?, ?, ?)",
    [messageId, body, emailSent ? 1 : 0, error?.slice(0, 400) || null],
  );

  if (emailSent) {
    await execute(
      `UPDATE contact_messages
          SET reply_count = reply_count + 1,
              replied_at  = CURRENT_TIMESTAMP,
              status      = 'replied'
        WHERE id = ?`,
      [messageId],
    );
  }

  return result.insertId;
}

/* -------------------------------- delete -------------------------------- */

/** Flags the lead as discarded. The row stays, so it can be restored. */
export async function softDeleteLead(id: number): Promise<boolean> {
  const result = await execute(
    "UPDATE contact_messages SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  return result.affectedRows > 0;
}

export async function restoreLead(id: number): Promise<boolean> {
  const result = await execute(
    "UPDATE contact_messages SET deleted_at = NULL WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

/**
 * Removes the row for good. Replies go with it via ON DELETE CASCADE.
 * There is no undo — the API only allows this on an already-discarded lead.
 */
export async function purgeLead(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM contact_messages WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export const isLeadStatus = (value: unknown): value is LeadStatus =>
  typeof value === "string" &&
  (LEAD_STATUSES as readonly string[]).includes(value);
