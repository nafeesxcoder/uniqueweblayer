import { NextResponse } from "next/server";
import {
  listTestimonials,
  createTestimonial,
} from "../../lib/server/testimonials";
import { readAdmin } from "../../lib/server/auth";
import { createTestimonialSchema } from "../../lib/server/validation";
import { handler, unauthorized } from "../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/testimonials
 *
 * Published quotes for anyone; a signed-in admin also gets the drafts, so the
 * admin list can show something you have not published yet.
 */
export const GET = handler(async (request: Request) => {
  const isAdmin = Boolean(readAdmin(request));
  const all = new URL(request.url).searchParams.get("all") === "1";
  const testimonials = await listTestimonials(!(isAdmin && all));
  return NextResponse.json({ testimonials });
});

/** POST /api/testimonials  (admin) */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const data = createTestimonialSchema.parse(await request.json());
  const testimonial = await createTestimonial(data);

  return NextResponse.json({ testimonial }, { status: 201 });
});
