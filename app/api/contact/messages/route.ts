import { NextResponse } from "next/server";
import { listLeads, leadCounts } from "../../../lib/server/contact";
import { readAdmin } from "../../../lib/server/auth";
import { handler, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/contact/messages  (admin) */
export const GET = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
  // ?deleted=1 returns the discarded leads instead of the live ones.
  const deleted = searchParams.get("deleted") === "1";

  const [messages, counts] = await Promise.all([
    listLeads(Number.isFinite(limit) ? limit : 50, deleted),
    leadCounts(),
  ]);

  return NextResponse.json({ messages, counts });
});
