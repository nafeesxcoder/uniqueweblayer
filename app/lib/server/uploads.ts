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

/** Product logos and screenshots. Raster only, because these are shown publicly. */
export async function saveProductImage(file: unknown): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  if (file.size > MAX_BYTES) {
    throw new ApiError(400, "Image is too large — 5 MB maximum");
  }
  if (!ALLOWED.has(file.type) || file.type === "image/svg+xml") {
    throw new ApiError(400, "Upload a PNG, JPG, WEBP, GIF or AVIF image");
  }

  const filename = `product-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
  try {
    await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: MAX_WIDTH, height: 2400, fit: "inside", withoutEnlargement: true })
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

/**
 * Stores a client logo for a testimonial. Always re-encoded to WebP: logos are
 * shown publicly, and refusing SVG means an upload can never carry a script.
 */
export async function saveTestimonialLogo(file: unknown): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  if (file.size > MAX_BYTES) {
    throw new ApiError(400, "Logo is too large — 5 MB maximum");
  }
  if (!ALLOWED.has(file.type) || file.type === "image/svg+xml") {
    throw new ApiError(400, "Upload the logo as PNG, JPG, WEBP, GIF or AVIF");
  }

  const filename = `logo-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
  try {
    await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(path.join(UPLOAD_DIR, filename));
  } catch (error) {
    throw new ApiError(
      400,
      `Could not process that logo: ${(error as Error).message}`,
    );
  }

  return `/uploads/${filename}`;
}

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

/**
 * A handwritten signature, stored as a transparent PNG. Ink on white paper is
 * turned into ink with alpha, so the page behind it still shows through.
 */
export async function saveSignatureImage(file: unknown): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  if (file.size > MAX_BYTES) {
    throw new ApiError(400, "Signature image is too large — 5 MB maximum");
  }
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new ApiError(400, "Upload the signature as PNG, JPG or WEBP");
  }

  const filename = `signature-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.png`;
  try {
    const source = sharp(Buffer.from(await file.arrayBuffer())).ensureAlpha();
    const meta = await sharp(Buffer.from(await file.arrayBuffer())).metadata();
    const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.alloc(data.length);
    const hasAlpha = Boolean(meta.hasAlpha);

    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const alpha = hasAlpha
        ? data[i + 3]
        : Math.max(0, Math.min(255, ((200 - lum) * 255) / 120));
      out[i] = 26;
      out[i + 1] = 18;
      out[i + 2] = 51;
      out[i + 3] = Math.round(alpha);
    }

    await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ threshold: 1 })
      .resize({ width: 600, height: 300, fit: "inside", withoutEnlargement: true })
      .png()
      .toFile(path.join(UPLOAD_DIR, filename));
  } catch (error) {
    throw new ApiError(400, `Could not process that signature: ${(error as Error).message}`);
  }

  return `/uploads/${filename}`;
}

