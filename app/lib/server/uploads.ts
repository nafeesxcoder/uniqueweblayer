import "server-only";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ApiError } from "./respond";

/**
 * Project screenshots.
 *
 * Files live in an `uploads/` folder at the project root — NOT in public/.
 * Next indexes public/ when it builds, so a file written there afterwards is
 * served as a 404 until the next build; uploads have to work immediately.
 * They are streamed instead by app/uploads/[...path]/route.ts, which also
 * sets a long cache header so the handler is hit once per image per visitor.
 *
 * Keeping them outside public/ has a second benefit: nothing user-supplied can
 * ever land next to the site's own static assets.
 *
 * Images are resized and re-encoded before they touch the disk: a 1.5 MB
 * screenshot became 36 KB of WebP in testing, and images are usually the
 * heaviest thing on a portfolio page.
 */

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

const MAX_BYTES = 5 * 1024 * 1024;
/** Cards render around 600px wide; 1600 covers retina with room to spare. */
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1200;
const WEBP_QUALITY = 82;

/**
 * Processes one uploaded image and returns the public path to store on the row,
 * or null when no file was supplied.
 */
export async function saveProjectImage(file: unknown): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  if (file.size > MAX_BYTES) {
    throw new ApiError(400, "Image is too large — 5 MB maximum");
  }
  if (!ALLOWED.has(file.type)) {
    throw new ApiError(
      400,
      "Only PNG, JPG, WEBP, GIF, AVIF or SVG images are allowed",
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;

  // SVG is already small and resolution independent — write it through.
  if (file.type === "image/svg+xml") {
    const filename = `${base}.svg`;
    await fsp.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return `/uploads/${filename}`;
  }

  const filename = `${base}.webp`;
  try {
    await sharp(buffer, { animated: true })
      .rotate() // honour EXIF orientation before metadata is stripped
      .resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(path.join(UPLOAD_DIR, filename));
  } catch (error) {
    throw new ApiError(
      400,
      `Could not process that image: ${(error as Error).message}`,
    );
  }

  return `/uploads/${filename}`;
}
