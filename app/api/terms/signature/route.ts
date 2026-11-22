import { NextResponse } from "next/server";
import { saveSignatureImage } from "../../../lib/server/uploads";
import { readAdmin } from "../../../lib/server/auth";
import { ApiError, handler, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/terms/signature  (admin) — stores a signature and returns its path. */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const form = await request.formData();
  const path = await saveSignatureImage(form.get("signature"));
  if (!path) throw new ApiError(400, "Choose a signature image to upload");

  return NextResponse.json({ path }, { status: 201 });
});
