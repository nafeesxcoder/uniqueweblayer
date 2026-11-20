import { NextResponse } from "next/server";
import { findDocument } from "../../../../lib/server/documents";
import { issueFileToken, readAdmin } from "../../../../lib/server/auth";
import { handler, notFound, unauthorized } from "../../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/documents/:id/link  (admin)
 *
 * Returns a URL to the file that works for 5 minutes without the Authorization
 * header — what a phone needs to hand the file to its own PDF / Office viewer.
 */
export const POST = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const doc = await findDocument(Number(id));
  if (!doc) return notFound("Document not found");

  const t = encodeURIComponent(issueFileToken(doc.id));
  return NextResponse.json({
    url: `/api/documents/${doc.id}/download?t=${t}`,
    viewUrl: `/api/documents/${doc.id}/download?t=${t}&inline=1`,
  });
});
