import { NextResponse } from "next/server";
import { deleteDocument } from "../../../lib/server/documents";
import { readAdmin } from "../../../lib/server/auth";
import { handler, notFound, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** DELETE /api/documents/:id  (admin) — removes the row and the file. */
export const DELETE = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const removed = await deleteDocument(Number(id));
  if (!removed) return notFound("Document not found");

  return NextResponse.json({ success: true });
});
