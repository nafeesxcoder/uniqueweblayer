"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminSession } from "./AdminShell";
import {
  fetchLeads,
  setLeadStatus,
  fetchReplies,
  sendLeadReply,
  deleteLead,
  restoreLead,
  purgeLead,
  ApiRequestError,
  type ContactLead,
  type LeadReply,
  type LeadCounts,
  type LeadStatus,
} from "../lib/api";
import { prettySource, prettyPage } from "../lib/sources";

/**
 * Every contact submission is saved to MySQL before the email is attempted,
 * so a mail outage never loses a lead. Without this page though, a lead that
 * failed to send would sit in the database unseen — which defeats the point.
 * The "Email failed" filter exists for exactly that case.
 *
 * Deleting is two stages. The first marks the lead discarded and moves it to
 * the Deleted tab, where it is still readable and restorable. Only from there
 * can it be removed from the database for good, so one misplaced click never
 * destroys a real enquiry.
 */

type Tab = LeadStatus | "all" | "undelivered" | "deleted";

const TABS: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Replied", value: "replied" },
  { label: "Email failed", value: "undelivered" },
  { label: "Archived", value: "archived" },
  { label: "Deleted", value: "deleted" },
];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "border-purple-500/40 bg-purple-500/15 text-purple-200",
  read: "border-white/15 bg-white/5 text-gray-300",
  replied: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  archived: "border-white/10 bg-white/3 text-gray-500",
};

function formatDate(value: string) {
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminInbox() {
  // The sign-in gate and the nav live in AdminShell, so this component is only
  // ever rendered for someone already signed in.
  const { token } = useAdminSession();

  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [counts, setCounts] = useState<LeadCounts | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Reply state, per expanded lead
  const [replies, setReplies] = useState<LeadReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const viewingDeleted = tab === "deleted";

  const load = useCallback(
    async (deleted = viewingDeleted) => {
      if (!token) return;
      setLoading(true);
      setError("");
      try {
        const data = await fetchLeads(token, 100, deleted);
        setLeads(data.messages);
        setCounts(data.counts);
      } catch (err) {
        setError(
          err instanceof ApiRequestError ? err.message : "Could not load enquiries.",
        );
      } finally {
        setLoading(false);
      }
    },
    [token, viewingDeleted],
  );

  useEffect(() => {
    void load(viewingDeleted);
    setExpanded(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, viewingDeleted]);

  /* ------------------------------- actions ------------------------------ */

  const openLead = async (lead: ContactLead) => {
    const isOpening = expanded !== lead.id;
    setExpanded(isOpening ? lead.id : null);
    setReplyText("");
    setReplies([]);
    setNotice("");

    if (!isOpening || !token) return;

    if (lead.status === "new" && !lead.deleted_at) {
      void changeStatus(lead, "read");
    }
    if (lead.reply_count > 0) {
      try {
        setReplies(await fetchReplies(lead.id, token));
      } catch {
        /* history is a nicety — not worth an error banner */
      }
    }
  };

  const changeStatus = async (lead: ContactLead, status: LeadStatus) => {
    if (!token) return;
    // Optimistic — the list should not jump while you are reading.
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    try {
      await setLeadStatus(lead.id, status, token);
      setCounts((c) =>
        c
          ? {
              ...c,
              unread:
                status === "new"
                  ? c.unread + 1
                  : lead.status === "new"
                    ? Math.max(0, c.unread - 1)
                    : c.unread,
            }
          : c,
      );
    } catch {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: lead.status } : l)),
      );
      setError("Could not update that enquiry.");
    }
  };

  const submitReply = async (lead: ContactLead) => {
    if (!token || replyText.trim().length < 5) return;
    setSending(true);
    setError("");
    setNotice("");
    try {
      const result = await sendLeadReply(lead.id, replyText.trim(), token);
      setReplies(result.replies);
      setReplyText("");
      setNotice(result.message);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? result.lead : l)));
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Could not send that reply.",
      );
    } finally {
      setSending(false);
    }
  };

  const discard = async (lead: ContactLead) => {
    if (!token) return;
    try {
      const result = await deleteLead(lead.id, token);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      setExpanded(null);
      setNotice(result.message);
      setCounts((c) =>
        c ? { ...c, total: Math.max(0, c.total - 1), deleted: c.deleted + 1 } : c,
      );
    } catch {
      setError("Could not delete that enquiry.");
    }
  };

  const undoDelete = async (lead: ContactLead) => {
    if (!token) return;
    try {
      await restoreLead(lead.id, token);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      setExpanded(null);
      setNotice(`${lead.name} restored to the inbox.`);
      setCounts((c) =>
        c ? { ...c, total: c.total + 1, deleted: Math.max(0, c.deleted - 1) } : c,
      );
    } catch {
      setError("Could not restore that enquiry.");
    }
  };

  const removeForever = async (lead: ContactLead) => {
    if (!token) return;
    const confirmed = window.confirm(
      `Permanently delete the enquiry from ${lead.name}?\n\n` +
        `This removes it from the database along with any replies. It cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await purgeLead(lead.id, token);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      setExpanded(null);
      setNotice(`${lead.name} removed from the database.`);
      setCounts((c) => (c ? { ...c, deleted: Math.max(0, c.deleted - 1) } : c));
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Could not remove that enquiry.",
      );
    }
  };

  /* ------------------------------ filtering ----------------------------- */

  const visible = useMemo(() => {
    if (tab === "all" || tab === "deleted") return leads;
    if (tab === "undelivered") return leads.filter((l) => l.email_sent === 0);
    return leads.filter((l) => l.status === tab);
  }, [leads, tab]);

  return (
    <div>
      <div>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="bg-linear-to-r from-white to-purple-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Enquiries
            </h1>
            {counts && (
              <p className="mt-2 text-sm text-gray-400">
                {counts.total} in the inbox · {counts.unread} new
                {counts.undelivered > 0 && (
                  <span className="text-amber-300">
                    {" "}
                    · {counts.undelivered} email
                    {counts.undelivered > 1 ? "s" : ""} failed
                  </span>
                )}
                {counts.deleted > 0 && (
                  <span className="text-gray-500"> · {counts.deleted} deleted</span>
                )}
              </p>
            )}
          </div>

          <button
            onClick={() => void load()}
            disabled={loading}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* Undelivered warning — the reason this page exists */}
        {counts && counts.undelivered > 0 && !viewingDeleted && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <p className="text-sm text-amber-200">
              {counts.undelivered} enquir
              {counts.undelivered > 1 ? "ies were" : "y was"} saved but the
              notification email did not send. Check the SMTP settings in{" "}
              <code className="font-mono">.env.local</code> — and reply to{" "}
              {counts.undelivered > 1 ? "these" : "this"} by hand.
            </p>
          </div>
        )}

        {notice && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t.value;
            const badge =
              t.value === "deleted" && counts?.deleted ? ` ${counts.deleted}` : "";
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  active
                    ? "border-transparent bg-linear-to-r from-purple-600 to-pink-600 text-white"
                    : "border-white/10 bg-white/4 text-gray-400 hover:border-purple-500/40 hover:text-white"
                }`}
              >
                {t.label}
                {badge}
              </button>
            );
          })}
        </div>

        {viewingDeleted && (
          <p className="mb-5 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-gray-400">
            These are flagged as deleted and hidden from the inbox. Restore one,
            or remove it from the database for good — that part cannot be undone.
          </p>
        )}

        {/* List */}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple-500/25 py-20 text-center">
            <p className="text-gray-400">
              {loading ? "Loading…" : "Nothing here yet."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((lead) => {
              const open = expanded === lead.id;
              return (
                <li key={lead.id} className="uwl-panel overflow-hidden rounded-2xl border">
                  <button
                    onClick={() => void openLead(lead)}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left"
                    aria-expanded={open}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{lead.name}</span>

                        {lead.deleted_at ? (
                          <span className="rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-red-300">
                            Deleted
                          </span>
                        ) : (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_STYLES[lead.status]}`}
                          >
                            {lead.status}
                          </span>
                        )}

                        {lead.reply_count > 0 && (
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
                            {lead.reply_count} {lead.reply_count > 1 ? "replies" : "reply"}
                          </span>
                        )}

                        {lead.email_sent === 0 && (
                          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
                            Email failed
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-sm text-gray-400">
                        {lead.service}
                        {lead.budget ? ` · ${lead.budget}` : ""}
                      </p>
                      {!open && (
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {lead.message}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-gray-500">
                      {formatDate(lead.created_at)}
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                        {lead.message}
                      </p>

                      {/* Contact shortcuts */}
                      <div className="mt-5 flex flex-wrap gap-3 text-sm">
                        <a
                          href={`mailto:${lead.email}?subject=Re: ${encodeURIComponent(lead.service)}`}
                          className="rounded-xl border border-purple-500/40 px-4 py-2 text-purple-200 transition hover:bg-purple-600/10"
                        >
                          {lead.email}
                        </a>
                        <a
                          href={`tel:${lead.mobile}`}
                          className="rounded-xl border border-white/15 px-4 py-2 text-gray-300 transition hover:bg-white/5"
                        >
                          {lead.mobile}
                        </a>
                        <a
                          href={`https://wa.me/${lead.mobile.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl border border-green-500/40 px-4 py-2 text-green-400 transition hover:bg-green-500/10"
                        >
                          WhatsApp
                        </a>
                      </div>

                      {/*
                        Where this one came from. Only shown when it was
                        recorded — enquiries from before this was added have
                        nothing to say and a row of "unknown" is just noise.
                      */}
                      {(lead.source || lead.landing_page) && (
                        <p className="mt-4 text-xs text-gray-500">
                          Came from{" "}
                          <span className="text-gray-400">
                            {prettySource(lead.source)}
                          </span>
                          {lead.landing_page && (
                            <>
                              {" · started on "}
                              <span className="text-gray-400">
                                {prettyPage(lead.landing_page)}
                              </span>
                            </>
                          )}
                        </p>
                      )}

                      {/* Reply history */}
                      {replies.length > 0 && (
                        <div className="mt-6 space-y-3">
                          <h3 className="text-sm font-medium text-gray-400">
                            Your replies
                          </h3>
                          {replies.map((r) => (
                            <div
                              key={r.id}
                              className="rounded-xl border border-white/10 bg-white/4 px-4 py-3"
                            >
                              <div className="mb-1.5 flex items-center gap-2 text-[11px] text-gray-500">
                                {formatDate(r.created_at)}
                                {r.email_sent === 0 && (
                                  <span className="text-amber-300">
                                    · not sent{r.error ? `: ${r.error}` : ""}
                                  </span>
                                )}
                              </div>
                              <p className="whitespace-pre-wrap text-sm text-gray-300">
                                {r.body}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply box */}
                      {!lead.deleted_at && (
                        <div className="mt-6">
                          <label
                            htmlFor={`reply-${lead.id}`}
                            className="mb-1.5 block text-xs font-medium text-gray-400"
                          >
                            Reply to {lead.name}
                          </label>
                          <textarea
                            id={`reply-${lead.id}`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={5}
                            placeholder={`Hi ${lead.name},\n\nThanks for getting in touch about ${lead.service}…`}
                            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                          />
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => void submitReply(lead)}
                              disabled={sending || replyText.trim().length < 5}
                              className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {sending ? "Sending…" : "Send reply"}
                            </button>
                            <span className="text-xs text-gray-500">
                              Sent from {`contact@uniqueweblayer.com`} — their
                              reply comes back to the inbox.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Status + delete */}
                      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                        {!lead.deleted_at &&
                          (["new", "read", "replied", "archived"] as LeadStatus[]).map(
                            (s) => (
                              <button
                                key={s}
                                onClick={() => void changeStatus(lead, s)}
                                disabled={lead.status === s}
                                className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
                                  lead.status === s
                                    ? "cursor-default border-transparent bg-white/10 text-gray-500"
                                    : "border-white/15 text-gray-300 hover:border-purple-500/50 hover:text-white"
                                }`}
                              >
                                {s}
                              </button>
                            ),
                          )}

                        <span className="flex-1" />

                        {lead.deleted_at ? (
                          <>
                            <button
                              onClick={() => void undoDelete(lead)}
                              className="rounded-full border border-emerald-500/40 px-3 py-1 text-xs text-emerald-300 transition hover:bg-emerald-500/10"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => void removeForever(lead)}
                              className="rounded-full border border-red-500/50 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/15"
                            >
                              Delete permanently
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => void discard(lead)}
                            className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
