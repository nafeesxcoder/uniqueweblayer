import { NextResponse } from "next/server";
import {
  findTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../../lib/server/testimonials";
import { readAdmin } from "../../../lib/server/auth";
import { updateTestimonialSchema } from "../../../lib/server/validation";
import { handler, notFound, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/testimonials/:id  (admin) */
export const PATCH = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const data = updateTestimonialSchema.parse(await request.json());
  const testimonial = await updateTestimonial(Number(id), data);
  if (!testimonial) return notFound("Testimonial not found");

  return NextResponse.json({ testimonial });
});

/**
 * DELETE /api/testimonials/:id  (admin)
 *
 * Straight delete, no Deleted tab: unlike an enquiry, a quote here was typed
 * by you and can be typed again. The UI asks for confirmation first.
 */
export const DELETE = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const existing = await findTestimonial(Number(id));
  if (!existing) return notFound("Testimonial not found");

  await deleteTestimonial(existing.id);
  return NextResponse.json({ success: true });
});
