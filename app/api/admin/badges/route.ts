import { NextResponse } from "next/server";
import { readAdmin } from "../../../lib/server/auth";
import { handler, unauthorized } from "../../../lib/server/respond";
import { queryOne } from "../../../lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/badges  (admin)
 *
 * The counts the sidebar shows next to Enquiries and Projects. Deliberately
 * separate from /api/admin/overview: that one checks the mail server, which
 * takes a second, and the nav is loaded on every admin page.
 */
export const GET = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const row = await queryOne<{ unread: number | null; drafts: number | null }>(
    `SELECT
       (SELECT COUNT(*) FROM contact_messages
         WHERE deleted_at IS NULL AND status = 'new')  AS unread,
       (SELECT COUNT(*) FROM projects
         WHERE is_published = 0)                       AS drafts`,
  );

  return NextResponse.json({
    unread: Number(row?.unread || 0),
    drafts: Number(row?.drafts || 0),
  });
});
