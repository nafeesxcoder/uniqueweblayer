"use client";

import { useCallback, useEffect, useState } from "react";
import { FiBarChart2, FiRefreshCw } from "react-icons/fi";
import { useAdminSession } from "./AdminShell";
import { fetchInsights, ApiRequestError, type AdminInsights, type InsightRow } from "../lib/api";
import { prettySource, prettyPage } from "../lib/sources";

/**
 * Where the work is coming from, counted from your own enquiries table.
 *
 * This is deliberately NOT a copy of Google Analytics. GA counts visits, which
 * an ad blocker can hide and which tell you nothing about who actually wrote
 * in. Every number here is one real enquiry sitting in your inbox, so the two
 * will never agree and this is the one to trust when deciding where to spend
 * time.
 *
 * Discarded enquiries are left out everywhere — spam you deleted should not
 * make a service look popular.
 */

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "1 year" },
];

function weekLabel(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function Stat({
  label,
  value,
  hint,
  tone = "normal",
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "normal" | "alert" | "good";
}) {
  const ring =
    tone === "alert"
      ? "border-amber-500/40 bg-amber-500/8"
      : tone === "good"
        ? "border-emerald-500/30 bg-emerald-500/8"
        : "border-white/10 bg-white/4";
  const text =
    tone === "alert"
      ? "text-amber-300"
      : tone === "good"
        ? "text-emerald-300"
        : "text-white";

  return (
    <div className={`rounded-2xl border px-5 py-4 ${ring}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1.5 text-3xl font-bold ${text}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

/**
 * Vertical bars, one per week. Plain divs rather than a charting library —
 * four numbers do not justify 90KB of JavaScript, and this stays readable
 * when the admin theme changes.
 */
function WeeklyChart({ weeks }: { weeks: { weekStart: string; count: number }[] }) {
  if (!weeks.length) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        No enquiries in this period yet.
      </p>
    );
  }

  /*
   * A week with no enquiries is missing from the query result — GROUP BY has
   * nothing to group. Left as-is the chart closes the gap and a quiet fortnight
   * looks like a busy one, so the empty weeks are put back as zeroes.
   */
  const filled: { weekStart: string; count: number }[] = [];
  const cursor = new Date(`${weeks[0].weekStart}T00:00:00`);
  const last = new Date(`${weeks[weeks.length - 1].weekStart}T00:00:00`);
  const counts = new Map(weeks.map((w) => [w.weekStart, w.count]));

  while (cursor <= last && filled.length < 60) {
    const key = cursor.toISOString().slice(0, 10);
    filled.push({ weekStart: key, count: counts.get(key) || 0 });
    cursor.setDate(cursor.getDate() + 7);
  }

  const peak = Math.max(...filled.map((w) => w.count), 1);
  // Only the last 26 bars stay legible on a phone.
  const shown = filled.slice(-26);

  return (
    <div className="flex h-48 items-stretch gap-1.5 overflow-x-auto pb-1">
      {shown.map((w) => (
        <div
          key={w.weekStart}
          className="group flex h-full min-w-[18px] flex-1 flex-col items-center justify-end gap-1.5"
          title={`Week of ${weekLabel(w.weekStart)} — ${w.count} ${
            w.count === 1 ? "enquiry" : "enquiries"
          }`}
        >
          <span className="h-4 text-[11px] font-medium text-gray-400 opacity-0 transition group-hover:opacity-100">
            {w.count}
          </span>
          {/*
            The track takes the leftover height, so the bar's percentage has
            something definite to measure against. Without it the bar sits in
            an auto-height box and renders at zero — i.e. no chart at all.
          */}
          <div className="flex w-full flex-1 flex-col justify-end">
            <div
              className="w-full rounded-t bg-gradient-to-t from-purple-600/60 to-purple-400 transition group-hover:from-purple-500 group-hover:to-purple-300"
              style={{
                height: `${w.count === 0 ? 2 : Math.max((w.count / peak) * 100, 6)}%`,
                opacity: w.count === 0 ? 0.35 : 1,
              }}
            />
          </div>
          <span className="whitespace-nowrap text-[10px] text-gray-600">
            {weekLabel(w.weekStart)}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Horizontal bars with the count on the right. */
function Breakdown({
  title,
  note,
  rows,
  total,
  format = (s: string) => s,
  empty,
}: {
  title: string;
  note?: string;
  rows: InsightRow[];
  total: number;
  format?: (label: string) => string;
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/4 p-5">
      <h2 className="text-sm font-semibold tracking-wide text-gray-300 uppercase">
        {title}
      </h2>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => {
            const share = total > 0 ? Math.round((row.count / total) * 100) : 0;
            return (
              <li key={row.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-gray-300" title={row.label}>
                    {format(row.label)}
                  </span>
                  <span className="shrink-0 tabular-nums text-gray-400">
                    {row.count}
                    <span className="ml-1.5 text-xs text-gray-600">{share}%</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-purple-500/70"
                    style={{ width: `${Math.max(share, 2)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function AdminInsights() {
  const { token } = useAdminSession();
  const [days, setDays] = useState(90);
  const [data, setData] = useState<AdminInsights | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchInsights(token, days));
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not load the insights.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, days]);

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

  const { totals } = data;
  const sourceKnown = data.bySource.some((r) => r.label !== "unknown");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            <FiBarChart2 className="text-purple-400" />
            Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Counted from your own enquiries — not page views.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/10 bg-white/4 p-1">
            {RANGES.map((r) => (
              <button
                key={r.days}
                type="button"
                onClick={() => setDays(r.days)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  days === r.days
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            title="Refresh"
            className="rounded-xl border border-white/10 bg-white/4 p-2.5 text-gray-400 transition hover:text-white disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Enquiries" value={totals.total} hint={`Last ${data.days} days`} />
        <Stat
          label="Average a week"
          value={totals.perWeek}
          hint="Spread across the whole period"
        />
        <Stat
          label="Replied to"
          value={totals.replied}
          tone={totals.replied > 0 ? "good" : "normal"}
          hint={
            totals.total > 0
              ? `${Math.round((totals.replied / totals.total) * 100)}% of them`
              : undefined
          }
        />
        <Stat
          label="Email failed"
          value={totals.undelivered}
          tone={totals.undelivered > 0 ? "alert" : "normal"}
          hint={totals.undelivered > 0 ? "Notification never sent" : "All delivered"}
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/4 p-5">
        <h2 className="text-sm font-semibold tracking-wide text-gray-300 uppercase">
          Week by week
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Hover a bar for the count. Weeks start on Monday.
        </p>
        <div className="mt-5">
          <WeeklyChart weeks={data.weekly} />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Breakdown
          title="Most asked-for service"
          rows={data.byService}
          total={totals.total}
          empty="Nothing to show yet."
        />

        <Breakdown
          title="Where the visitor came from"
          note={
            sourceKnown
              ? undefined
              : "Recorded from the date this was added — older enquiries show as “not recorded”."
          }
          rows={data.bySource}
          total={totals.total}
          format={prettySource}
          empty="Nothing to show yet."
        />

        <Breakdown
          title="Page the enquiry started on"
          note="The first page of that visit, not the contact page."
          rows={data.byLanding}
          total={totals.total}
          format={prettyPage}
          empty="Nothing to show yet."
        />

        <Breakdown
          title="Budget range"
          rows={data.byBudget}
          total={totals.total}
          empty="Nothing to show yet."
        />
      </div>
    </div>
  );
}
