import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "../../lib/server/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves uploaded project screenshots from /uploads/<file>.
 *
 * Next indexes public/ at build time, so a screenshot written there after the
 * build 404s until the next deploy — which defeats the point of being able to
 * add a project without touching code. Files therefore live in ./uploads and
 * are streamed from here instead.
 *
 * Filenames are generated server-side (timestamp + random hex) and never
 * change, so responses are marked immutable: a browser fetches each image once
 * and this handler is out of the path on every later view.
 */

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Resolve, then confirm the result is still inside UPLOAD_DIR. Without this
  // check a request for ../../.env.local would escape the folder.
  const target = path.resolve(UPLOAD_DIR, ...segments);
  const root = path.resolve(UPLOAD_DIR);
  if (target !== root && !target.startsWith(root + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(target).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) return new Response("Not found", { status: 404 });

  let stat: fs.Stats;
  try {
    stat = await fsp.stat(target);
    if (!stat.isFile()) throw new Error("not a file");
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const file = await fsp.readFile(target);

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      // Uploaded SVG could otherwise execute script in the page's origin.
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
