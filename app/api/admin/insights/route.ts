import { NextResponse } from "next/server";
import { readAdmin } from "../../../lib/server/auth";
import { handler, unauthorized } from "../../../lib/server/respond";
import { query, queryOne } from "../../../lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/insights?days=90  (admin)
 *
 * Everything the Insights page shows, from the enquiries table. No third
 * party involved, so nothing here can be switched off by an ad blocker and
 * every number counts an actual enquiry rather than a page view.
 *
 * Deleted enquiries are left out everywhere — spam you threw away should not
 * make a service line look popular.
 */
export const GET = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const raw = Number(new URL(request.url).searchParams.get("days"));
  // Clamped and inlined: MySQL will not take an interval as a placeholder,
  // and this has to be a number we produced, never text from the URL.
  const days = [7, 30, 90, 365].includes(raw) ? raw : 90;

  const since = `AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)`;
  const live = "WHERE deleted_at IS NULL";

  const [totals, weekly, byService, bySource, byLanding, byBudget] =
    await Promise.all([
      queryOne<{
        total: number;
        replied: number | null;
        undelivered: number | null;
      }>(
        `SELECT COUNT(*) AS total,
                SUM(status = 'replied') AS replied,
                SUM(email_sent = 0)     AS undelivered
           FROM contact_messages ${live} ${since}`,
      ),

      // Monday-based weeks, oldest first, so the chart reads left to right.
      query<{ week_start: string; count: number }>(
        `SELECT DATE(DATE_SUB(created_at, INTERVAL WEEKDAY(created_at) DAY)) AS week_start,
                COUNT(*) AS count
           FROM contact_messages ${live} ${since}
          GROUP BY week_start
          ORDER BY week_start ASC`,
      ),

      query<{ label: string; count: number }>(
        `SELECT service AS label, COUNT(*) AS count
           FROM contact_messages ${live} ${since}
          GROUP BY service
          ORDER BY count DESC
          LIMIT 10`,
      ),

      query<{ label: string; count: number }>(
        `SELECT COALESCE(NULLIF(source, ''), 'unknown') AS label, COUNT(*) AS count
           FROM contact_messages ${live} ${since}
          GROUP BY label
          ORDER BY count DESC
          LIMIT 10`,
      ),

      query<{ label: string; count: number }>(
        `SELECT COALESCE(NULLIF(landing_page, ''), 'unknown') AS label, COUNT(*) AS count
           FROM contact_messages ${live} ${since}
          GROUP BY label
          ORDER BY count DESC
          LIMIT 10`,
      ),

      query<{ label: string; count: number }>(
        `SELECT COALESCE(NULLIF(budget, ''), 'not specified') AS label, COUNT(*) AS count
           FROM contact_messages ${live} ${since}
          GROUP BY label
          ORDER BY count DESC
          LIMIT 10`,
      ),
    ]);

  const total = Number(totals?.total || 0);

  return NextResponse.json({
    days,
    totals: {
      total,
      replied: Number(totals?.replied || 0),
      undelivered: Number(totals?.undelivered || 0),
      perWeek: days >= 7 ? Number((total / (days / 7)).toFixed(1)) : total,
    },
    weekly: weekly.map((w) => ({
      weekStart: String(w.week_start).slice(0, 10),
      count: Number(w.count),
    })),
    byService: byService.map((r) => ({ ...r, count: Number(r.count) })),
    bySource: bySource.map((r) => ({ ...r, count: Number(r.count) })),
    byLanding: byLanding.map((r) => ({ ...r, count: Number(r.count) })),
    byBudget: byBudget.map((r) => ({ ...r, count: Number(r.count) })),
  });
});
