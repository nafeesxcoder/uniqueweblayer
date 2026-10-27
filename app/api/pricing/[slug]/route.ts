import { NextResponse } from "next/server";
import {
  setServicePricing,
  resetServicePricing,
  getServicePricing,
  isKnownService,
} from "../../../lib/server/pricing";
import { readAdmin } from "../../../lib/server/auth";
import { servicePricingSchema } from "../../../lib/server/validation";
import { handler, notFound, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** PATCH /api/pricing/:slug  (admin) — set the price for one service. */
export const PATCH = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { slug } = await params;
  // Only slugs that exist in the code list — otherwise a typo would write a
  // row nothing ever reads and quietly do nothing.
  if (!isKnownService(slug)) return notFound("No such service");

  const data = servicePricingSchema.parse(await request.json());
  await setServicePricing(slug, data);

  return NextResponse.json({ slug, pricing: await getServicePricing(slug) });
});

/** DELETE /api/pricing/:slug  (admin) — back to the price written in code. */
export const DELETE = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { slug } = await params;
  if (!isKnownService(slug)) return notFound("No such service");

  await resetServicePricing(slug);
  return NextResponse.json({ slug, pricing: await getServicePricing(slug) });
});
