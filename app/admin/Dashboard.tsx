"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAdminSession } from "./AdminShell";
import { fetchOverview, ApiRequestError, type AdminOverview } from "../lib/api";

/**
 * What this page is for: answering "is there anything I need to do right now?"
 * in one glance, then getting out of the way.
 *
 * So the numbers that can demand action come first — unanswered enquiries, mail
 * that failed to send, unpublished projects — and the rest is context. A wall
 * of vanity totals would look busier and tell you less.
 */

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Stat({
  label,
  value,
  tone = "normal",
  href,
  hint,
}: {
  label: string;
  value: number | string;
  tone?: "normal" | "alert" | "good";
  href?: string;
  hint?: string;
}) {
  const toneRing =
    tone === "alert"
      ? "border-amber-500/40 bg-amber-500/8"
      : tone === "good"
        ? "border-emerald-500/30 bg-emerald-500/8"
        : "border-white/10 bg-white/4";

  const toneText =
    tone === "alert"
      ? "text-amber-300"
      : tone === "good"
        ? "text-emerald-300"
        : "text-white";

  const body = (
    <div
      className={`rounded-2xl border px-5 py-4 transition ${toneRing} ${
        href ? "hover:border-purple-500/50" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1.5 text-3xl font-bold ${toneText}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

export default function Dashboard() {
  const { token, email } = useAdminSession();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchOverview(token));
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not load the dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return <p className="py-20 text-center text-gray-500">Loading…</p>;
  }

  if (error && !data) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const { leads, projects, recentLeads, recentProjects, account, smtp, testimonials } =
    data;
  const needsAttention = leads.unread > 0 || leads.undelivered > 0;

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {needsAttention
              ? "A few things are waiting for you."
              : "Everything is up to date."}
            {account.lastLoginAt && (
              <span className="text-gray-500">
                {" "}
                · last signed in {formatDate(account.lastLoginAt)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Mail health — the one failure you would otherwise never notice */}
      {!smtp.ok && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-200">
            <strong>Email is not working.</strong> {smtp.reason}. New enquiries
            are still saved here, but no notification is reaching your inbox —
            check this page regularly until it is fixed.
          </p>
        </div>
      )}

      {/* Numbers that can need action */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-400">
          Enquiries
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Unread"
            value={leads.unread}
            tone={leads.unread > 0 ? "alert" : "good"}
            href="/admin/enquiries"
            hint={leads.unread > 0 ? "Waiting for a reply" : "All caught up"}
          />
          <Stat
            label="This week"
            value={leads.thisWeek}
            href="/admin/enquiries"
            hint="Last 7 days"
          />
          <Stat label="Total" value={leads.total} href="/admin/enquiries" />
          <Stat
            label="Email failed"
            value={leads.undelivered}
            tone={leads.undelivered > 0 ? "alert" : "normal"}
            href="/admin/enquiries"
            hint={leads.undelivered > 0 ? "Answer these by hand" : undefined}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-400">
          Portfolio
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Published" value={projects.published} href="/admin/projects" />
          <Stat
            label="Drafts"
            value={projects.drafts}
            tone={projects.drafts > 0 ? "alert" : "normal"}
            href="/admin/projects"
            hint={projects.drafts > 0 ? "Not visible on the site" : undefined}
          />
          <Stat label="Featured" value={projects.featured} href="/admin/projects" />
          <Stat
            label="Testimonials"
            value={testimonials.published}
            href="/admin/testimonials"
            hint={
              testimonials.total > testimonials.published
                ? `${testimonials.total - testimonials.published} hidden`
                : testimonials.published === 0
                  ? "Ask a client for one"
                  : undefined
            }
          />
        </div>
      </section>

      {/* Two lists side by side */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="uwl-panel rounded-2xl border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Latest enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-xs text-purple-300 hover:text-purple-200"
            >
              See all
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              Nothing yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">
                      {lead.name}
                      {lead.status === "new" && (
                        <span className="ml-2 rounded-full border border-purple-500/40 bg-purple-500/15 px-2 py-0.5 text-[10px] uppercase text-purple-200">
                          new
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {lead.service}
                      {lead.budget ? ` · ${lead.budget}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-500">
                    {formatDate(lead.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="uwl-panel rounded-2xl border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Recently edited projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-purple-300 hover:text-purple-200"
            >
              Manage
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No projects yet —{" "}
              <Link href="/admin/projects" className="text-purple-300">
                add your first one
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {recentProjects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between gap-3"
                >
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="truncate text-sm text-white hover:text-purple-300"
                  >
                    {project.title}
                  </Link>
                  <span className="shrink-0 text-xs text-gray-500">
                    {formatDate(project.updated_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-400">
          Shortcuts
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects?new=1"
            className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Add a project
          </Link>
          <Link
            href="/admin/enquiries"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
          >
            Open enquiries
          </Link>
          <Link
            href="/admin/settings"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
          >
            Change password
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-600">
          Signed in as {email || account.email}
          {account.passwordChangedAt
            ? ` · password last changed ${formatDate(account.passwordChangedAt)}`
            : " · still using the password from .env.local"}
        </p>
      </section>
    </div>
  );
}
