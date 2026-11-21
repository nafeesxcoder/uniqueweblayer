import { NextResponse } from "next/server";
import { saveProductImage } from "../../../lib/server/uploads";
import { readAdmin } from "../../../lib/server/auth";
import { ApiError, handler, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/products/upload  (admin) — stores a logo or screenshot, returns its path. */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const form = await request.formData();
  const path = await saveProductImage(form.get("image"));
  if (!path) throw new ApiError(400, "Choose an image to upload");

  return NextResponse.json({ path }, { status: 201 });
});
