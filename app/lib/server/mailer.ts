import "server-only";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "./env";

/**
 * Nodemailer transport for the cPanel mailbox on uniqueweblayer.com.
 *
 *   SMTP  uniqueweblayer.com : 465  (SSL/TLS, auth required)
 *
 * If SMTP is not configured, or a send fails, these resolve with sent:false
 * rather than throwing — the lead is already saved in MySQL by then, and losing
 * the enquiry would be far worse than missing the notification.
 */

declare global {
  // eslint-disable-next-line no-var
  var __uwlMailer: Transporter | null | undefined;
}

function getTransporter(): Transporter | null {
  if (global.__uwlMailer !== undefined) return global.__uwlMailer;

  const { host, port, secure, user, password } = env.smtp;
  if (!host || !user || !password) {
    global.__uwlMailer = null;
    return null;
  }

  global.__uwlMailer = nodemailer.createTransport({
    host,
    // port 465 → implicit TLS; 587 → STARTTLS
    port,
    secure,
    auth: { user, pass: password },
    tls: { minVersion: "TLSv1.2" },
    pool: true,
    maxConnections: 3,
  });

  return global.__uwlMailer;
}

export async function verifyMailer(): Promise<{ ok: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { ok: false, reason: "SMTP is not configured" };
  try {
    await transporter.verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: (error as Error).message };
  }
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const from = () => `"${env.smtp.fromName}" <${env.smtp.fromAddress}>`;

export interface Lead {
  name: string;
  email: string;
  mobile: string;
  service: string;
  budget?: string;
  message: string;
}

/* ------------------------------------------------------------------ */
/*  Lead notification — goes to info@uniqueweblayer.com                 */
/* ------------------------------------------------------------------ */

function leadHtml({ name, mobile, email, service, budget, message }: Lead) {
  const row = (label: string, value: unknown) =>
    `<tr>
       <td style="padding:7px 0;color:#9ca3af;width:130px;vertical-align:top">${label}</td>
       <td style="padding:7px 0;font-weight:600;color:#e5e7eb">${escapeHtml(value)}</td>
     </tr>`;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;background:#0f0f17;border-radius:14px;overflow:hidden;border:1px solid #2a2a3a">
    <div style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:26px 30px">
      <h2 style="margin:0;color:#fff;font-size:20px">New Quote Request</h2>
      <p style="margin:5px 0 0;color:#f3e8ff;font-size:13px">Unique Web Layer — website contact form</p>
    </div>
    <div style="padding:26px 30px;color:#e5e7eb;font-size:14px;line-height:1.7">
      <table style="width:100%;border-collapse:collapse">
        ${row("Name", name)}
        ${row("Mobile", mobile)}
        ${row("Email", email)}
        ${row("Service", service)}
        ${row("Budget", budget || "Not specified")}
      </table>
      <div style="margin-top:18px;padding:14px 16px;background:#1a1a26;border-left:3px solid #7c3aed;border-radius:8px">
        <p style="margin:0 0 6px;color:#9ca3af;font-size:12px">Message</p>
        <p style="margin:0;white-space:pre-wrap;color:#e5e7eb">${escapeHtml(message)}</p>
      </div>
      <p style="margin:22px 0 0;color:#6b7280;font-size:12px">
        Reply directly to this email to answer ${escapeHtml(name)}.
      </p>
    </div>
  </div>`;
}

export async function sendLeadNotification(
  lead: Lead,
): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: "SMTP is not configured" };

  try {
    await transporter.sendMail({
      from: from(),
      to: env.smtp.contactTo,
      replyTo: `"${lead.name}" <${lead.email}>`,
      subject: `New Quote Request — ${lead.service} (${lead.name})`,
      html: leadHtml(lead),
      text:
        `New quote request\n\n` +
        `Name: ${lead.name}\nMobile: ${lead.mobile}\nEmail: ${lead.email}\n` +
        `Service: ${lead.service}\nBudget: ${lead.budget || "Not specified"}\n\n` +
        `Message:\n${lead.message}\n`,
    });
    return { sent: true };
  } catch (error) {
    console.error("Lead email failed:", (error as Error).message);
    return { sent: false, reason: (error as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  Auto-reply — goes to the person who filled the form                 */
/* ------------------------------------------------------------------ */

export async function sendAutoReply(lead: Lead): Promise<{ sent: boolean }> {
  const transporter = getTransporter();
  if (!transporter || !env.smtp.sendAutoReply) return { sent: false };

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;background:#0f0f17;border-radius:14px;overflow:hidden;border:1px solid #2a2a3a">
    <div style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:26px 30px">
      <h2 style="margin:0;color:#fff;font-size:20px">Thanks for getting in touch</h2>
      <p style="margin:5px 0 0;color:#f3e8ff;font-size:13px">Unique Web Layer</p>
    </div>
    <div style="padding:26px 30px;color:#e5e7eb;font-size:14px;line-height:1.75">
      <p style="margin:0 0 14px">Hi ${escapeHtml(lead.name)},</p>
      <p style="margin:0 0 14px">
        We have your enquiry about <strong>${escapeHtml(lead.service)}</strong> and
        someone from the team will reply within one working day with a scope,
        a fixed quote and a delivery timeline.
      </p>
      <p style="margin:0 0 14px">
        If anything is urgent, reply to this email or message us on WhatsApp.
      </p>
      <div style="margin-top:20px;padding:14px 16px;background:#1a1a26;border-radius:8px;border:1px solid #2a2a3a">
        <p style="margin:0;color:#9ca3af;font-size:12px">General enquiries · <strong style="color:#e5e7eb">${env.smtp.contactTo}</strong></p>
        <p style="margin:5px 0 0;color:#9ca3af;font-size:12px">Projects &amp; quotes · <strong style="color:#e5e7eb">${env.smtp.fromAddress}</strong></p>
      </div>
      <p style="margin:22px 0 0;color:#6b7280;font-size:12px">— Unique Web Layer</p>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from: from(),
      to: lead.email,
      replyTo: env.smtp.contactTo,
      subject: "We received your enquiry — Unique Web Layer",
      html,
      text:
        `Hi ${lead.name},\n\n` +
        `We have your enquiry about ${lead.service} and will reply within one working day ` +
        `with a scope, a fixed quote and a delivery timeline.\n\n` +
        `General enquiries: ${env.smtp.contactTo}\n` +
        `Projects & quotes: ${env.smtp.fromAddress}\n\n— Unique Web Layer`,
    });
    return { sent: true };
  } catch (error) {
    console.error("Auto-reply failed:", (error as Error).message);
    return { sent: false };
  }
}

/* ------------------------------------------------------------------ */
/*  Admin reply — goes to the enquirer, from the admin inbox            */
/* ------------------------------------------------------------------ */

export async function sendReply({
  to,
  name,
  service,
  body,
}: {
  to: string;
  name: string;
  service: string;
  body: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: "SMTP is not configured" };

  // The admin types plain text; keep their line breaks and escape the rest.
  const paragraphs = escapeHtml(body)
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 14px">${block.replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;background:#0f0f17;border-radius:14px;overflow:hidden;border:1px solid #2a2a3a">
    <div style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:26px 30px">
      <h2 style="margin:0;color:#fff;font-size:20px">Unique Web Layer</h2>
      <p style="margin:5px 0 0;color:#f3e8ff;font-size:13px">Re: ${escapeHtml(service)}</p>
    </div>
    <div style="padding:26px 30px;color:#e5e7eb;font-size:14px;line-height:1.75">
      ${paragraphs}
      <div style="margin-top:22px;padding-top:16px;border-top:1px solid #2a2a3a">
        <p style="margin:0;color:#9ca3af;font-size:12px">
          ${escapeHtml(env.smtp.fromName)} · ${env.smtp.contactTo}
        </p>
      </div>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from: from(),
      to,
      // Replies land in the general inbox, where the team is watching.
      replyTo: env.smtp.contactTo,
      subject: `Re: ${service} — Unique Web Layer`,
      html,
      text: `Hi ${name},\n\n${body}\n\n— ${env.smtp.fromName}\n${env.smtp.contactTo}`,
    });
    return { sent: true };
  } catch (error) {
    console.error("Reply email failed:", (error as Error).message);
    return { sent: false, reason: (error as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  Password reset — goes to the admin address only                     */
/* ------------------------------------------------------------------ */

/**
 * The link is the only copy of the token; the database holds just its hash.
 * It is sent to the address stored on the admin account and nowhere else, so
 * asking for a reset from someone else's browser still only reaches you.
 */
export async function sendPasswordReset({
  to,
  link,
  expiresInMinutes,
}: {
  to: string;
  link: string;
  expiresInMinutes: number;
}): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: "SMTP is not configured" };

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;background:#0f0f17;border-radius:14px;overflow:hidden;border:1px solid #2a2a3a">
    <div style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:24px 28px">
      <h2 style="margin:0;color:#fff;font-size:19px">Reset your admin password</h2>
      <p style="margin:5px 0 0;color:#f3e8ff;font-size:13px">Unique Web Layer</p>
    </div>
    <div style="padding:26px 28px;color:#e5e7eb;font-size:14px;line-height:1.7">
      <p style="margin:0 0 16px">
        Someone asked to reset the password for the admin area. If that was you,
        use the button below. The link works once and expires in
        ${expiresInMinutes} minutes.
      </p>
      <p style="margin:0 0 20px">
        <a href="${link}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">Set a new password</a>
      </p>
      <p style="margin:0 0 6px;color:#9ca3af;font-size:12px">Or paste this into your browser:</p>
      <p style="margin:0 0 18px;word-break:break-all;color:#a78bfa;font-size:12px">${escapeHtml(link)}</p>
      <p style="margin:0;color:#9ca3af;font-size:12px">
        If you did not ask for this, ignore this email — your current password
        keeps working and nothing has changed.
      </p>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from: from(),
      to,
      subject: "Reset your admin password — Unique Web Layer",
      html,
      text:
        `Someone asked to reset the admin password for Unique Web Layer.\n\n` +
        `Set a new password: ${link}\n\n` +
        `The link works once and expires in ${expiresInMinutes} minutes.\n` +
        `If you did not ask for this, ignore this email.`,
    });
    return { sent: true };
  } catch (error) {
    console.error("Password reset email failed:", (error as Error).message);
    return { sent: false, reason: (error as Error).message };
  }
}