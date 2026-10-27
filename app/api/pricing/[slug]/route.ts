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

  // Parse and coerce to plain strings. The Zod schema validates the input,
  // but TypeScript cannot prove `.parse()` returns exactly `{ price: string;
  // delivery: string }` because `.trim()` chaining widens the output type to
  // `string | undefined`. Explicit `String(...)` here makes the assignment to
  // `setServicePricing` type-safe without weakening validation.
  const raw = servicePricingSchema.parse(await request.json());
  await setServicePricing(slug, {
    price: String(raw.price ?? ""),
    delivery: String(raw.delivery ?? ""),
  });

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