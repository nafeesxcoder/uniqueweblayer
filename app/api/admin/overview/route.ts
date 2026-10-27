import { NextResponse } from "next/server";
import { readAdmin } from "../../../lib/server/auth";
import { handler, unauthorized } from "../../../lib/server/respond";
import { leadCounts, listLeads } from "../../../lib/server/contact";
import { queryOne, query } from "../../../lib/server/db";
import { findAdminAccount } from "../../../lib/server/adminAccount";
import { verifyMailer } from "../../../lib/server/mailer";
import { countTestimonials } from "../../../lib/server/testimonials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/overview  (admin)
 *
 * Everything the dashboard shows, in one request. Five small queries on one
 * connection beat five round trips from the browser, and it keeps the page a
 * single loading state instead of five.
 */
export const GET = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const [
    leads,
    projectTotals,
    recentLeads,
    recentProjects,
    account,
    smtp,
    testimonials,
  ] = await Promise.all([
      leadCounts(),
      queryOne<{
        total: number;
        published: number | null;
        featured: number | null;
        drafts: number | null;
      }>(
        `SELECT COUNT(*) AS total,
                SUM(is_published = 1) AS published,
                SUM(featured = 1)     AS featured,
                SUM(is_published = 0) AS drafts
           FROM projects`,
      ),
      listLeads(5),
      query<{ id: number; title: string; slug: string; updated_at: string }>(
        `SELECT id, title, slug, updated_at
           FROM projects
          ORDER BY updated_at DESC
          LIMIT 5`,
      ),
      findAdminAccount(),
      // A dashboard that cannot tell you mail is broken is decoration — this
      // is the one check worth the extra second it costs.
      verifyMailer(),
      countTestimonials(),
    ]);

  // The enquiries that arrived this week, as a sense of how busy it has been.
  const week = await queryOne<{ count: number }>(
    `SELECT COUNT(*) AS count
       FROM contact_messages
      WHERE deleted_at IS NULL
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
  );

  return NextResponse.json({
    leads: { ...leads, thisWeek: Number(week?.count || 0) },
    projects: {
      total: Number(projectTotals?.total || 0),
      published: Number(projectTotals?.published || 0),
      featured: Number(projectTotals?.featured || 0),
      drafts: Number(projectTotals?.drafts || 0),
    },
    recentLeads,
    recentProjects,
    testimonials,
    account: {
      email: account?.email || "",
      passwordChangedAt: account?.password_changed_at || null,
      lastLoginAt: account?.last_login_at || null,
    },
    smtp: { ok: smtp.ok, reason: smtp.reason || null },
  });
});
