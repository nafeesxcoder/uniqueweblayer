import fsp from "node:fs/promises";
import { NextResponse } from "next/server";
import { findDocument, documentPath } from "../../../../lib/server/documents";
import { readAdmin, verifyFileToken } from "../../../../lib/server/auth";
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
/** Types a browser can show without running anything on this origin. */
const INLINE_SAFE = new Set([
  "application/pdf",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export const GET = handler(async (request: Request, { params }: Ctx) => {
  const { id } = await params;
  const docId = Number(id);
  const search = new URL(request.url).searchParams;

  // Either the admin session header (desktop fetch) or a 5-minute link token
  // for this one file (phones open the URL directly in their native viewer).
  const allowed =
    Boolean(readAdmin(request)) || verifyFileToken(search.get("t") || "", docId);
  if (!allowed) return unauthorized();

  const doc = await findDocument(docId);
  if (!doc) return notFound("Document not found");

  let file: Buffer;
  try {
    file = await fsp.readFile(documentPath(doc.stored_name));
  } catch {
    // The row survived but the file did not — say so rather than send nothing.
    return notFound("That file is missing from the server");
  }

  const mime = doc.mime_type || "application/octet-stream";
  // `inline` only for types that cannot run script (PDF, plain text, raster
  // images). Everything else stays `attachment`, so the phone hands it to
  // Word / Excel / Files instead of rendering it on this origin.
  const inline = search.get("inline") === "1" && INLINE_SAFE.has(mime);
  const asciiName = doc.original_name.replace(/[^\x20-\x7e]|["\\]/g, "_");
  const disposition = `${inline ? "inline" : "attachment"}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(doc.original_name)}`;

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(file.length),
      "Content-Disposition": disposition,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
