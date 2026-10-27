import { NextResponse } from "next/server";
import { listServicePrices } from "../../lib/server/pricing";
import { handler } from "../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/pricing
 *
 * Public: the home page and the services list read prices from here, so a
 * change in the admin panel shows up without a rebuild.
 */
export const GET = handler(async () => {
  return NextResponse.json({ pricing: await listServicePrices() });
});
