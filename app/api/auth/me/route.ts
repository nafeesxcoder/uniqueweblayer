import { NextResponse } from "next/server";
import { readAdmin } from "../../../lib/server/auth";
import { handler, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/auth/me — lets the UI check whether a stored token is still valid. */
export const GET = handler(async (request: Request) => {
  const admin = readAdmin(request);
  if (!admin) return unauthorized("Session expired — sign in again");
  return NextResponse.json({ admin: { email: admin.email } });
});
