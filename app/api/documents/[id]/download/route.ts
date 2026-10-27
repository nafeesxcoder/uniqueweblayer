import fsp from "node:fs/promises";
import { NextResponse } from "next/server";
import { findDocument, documentPath } from "../../../../lib/server/documents";
import { readAdmin } from "../../../../lib/server/auth";
import { handler, notFound, unauthorized } from "../../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/documents/:id/download  (admin)
 *
 * The only way a stored file leaves the server. The admin check happens before
 * anything is read, and the response is never cached — a document that was
 * deleted should not keep living in a browser cache.
 */
export const GET = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const doc = await findDocument(Number(id));
  if (!doc) return notFound("Document not found");

  let file: Buffer;
  try {
    file = await fsp.readFile(documentPath(doc.stored_name));
  } catch {
    // The row survived but the file did not — say so rather than send nothing.
    return notFound("That file is missing from the server");
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": doc.mime_type || "application/octet-stream",
      "Content-Length": String(file.length),
      // `attachment` so the browser saves it instead of trying to render it —
      // which also stops any HTML or SVG running on this origin.
      "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.original_name)}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
