import { NextResponse } from "next/server";
import { listDocuments, saveDocument } from "../../lib/server/documents";
import { readAdmin } from "../../lib/server/auth";
import { handler, unauthorized } from "../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/documents  (admin) — these are private, so there is no public read. */
export const GET = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();
  return NextResponse.json({ documents: await listDocuments() });
});

/** POST /api/documents  (admin) — multipart upload. */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const form = await request.formData();
  const document = await saveDocument(form.get("file"), {
    title: String(form.get("title") || "").trim(),
    note: String(form.get("note") || "").trim(),
  });

  return NextResponse.json({ document }, { status: 201 });
});
