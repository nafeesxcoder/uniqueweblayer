import { NextResponse } from "next/server";
import { saveTestimonialLogo } from "../../../lib/server/uploads";
import { readAdmin } from "../../../lib/server/auth";
import { ApiError, handler, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/testimonials/logo  (admin) — stores a client logo, returns its path. */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const form = await request.formData();
  const logo = await saveTestimonialLogo(form.get("logo"));
  if (!logo) throw new ApiError(400, "Choose a logo to upload");

  return NextResponse.json({ logo }, { status: 201 });
});
