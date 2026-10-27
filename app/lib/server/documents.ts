import "server-only";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { query, queryOne, execute } from "./db";
import { ApiError } from "./respond";

/**
 * Your own documents.
 *
 * These are private, which is the whole difference from project screenshots:
 * screenshots live in `uploads/` and are served to anyone by a public route.
 * Documents live in `storage/documents/`, which no route serves. The only way
 * out is the download endpoint, and that checks the admin session first.
 *
 * The name on disk is random. A file called `../../.env.local` or a second
 * upload called `invoice.pdf` therefore cannot escape the folder or overwrite
 * anything — the real name is kept in the database and put back only when you
 * download it.
 */

export const DOCUMENT_DIR = path.join(process.cwd(), "storage", "documents");
fs.mkdirSync(DOCUMENT_DIR, { recursive: true });

const MAX_BYTES = 25 * 1024 * 1024;

/**
 * What a business actually keeps: documents, spreadsheets, slides, scans,
 * archives. Executables and scripts are not on the list — there is no reason
 * to store one here, and plenty of reasons not to.
 */
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
  "application/rtf",
  "text/plain",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXT = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  ".zip", ".rtf", ".txt", ".csv", ".png", ".jpg", ".jpeg", ".webp", ".gif",
]);

export interface DocumentRow {
  id: number;
  title: string;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size_bytes: number;
  note: string | null;
  created_at: string;
}

export async function listDocuments(): Promise<DocumentRow[]> {
  return query<DocumentRow>(
    `SELECT id, title, original_name, stored_name, mime_type, size_bytes,
            note, created_at
       FROM documents
      ORDER BY created_at DESC`,
  );
}

export async function findDocument(id: number): Promise<DocumentRow | null> {
  return queryOne<DocumentRow>(
    `SELECT id, title, original_name, stored_name, mime_type, size_bytes,
            note, created_at
       FROM documents
      WHERE id = ?
      LIMIT 1`,
    [id],
  );
}

export async function countDocuments(): Promise<{
  total: number;
  bytes: number;
}> {
  const row = await queryOne<{ total: number; bytes: number | null }>(
    "SELECT COUNT(*) AS total, SUM(size_bytes) AS bytes FROM documents",
  );
  return { total: Number(row?.total || 0), bytes: Number(row?.bytes || 0) };
}

/** Absolute path of a stored file, with the folder re-checked after resolving. */
export function documentPath(storedName: string): string {
  const full = path.resolve(DOCUMENT_DIR, storedName);
  if (!full.startsWith(DOCUMENT_DIR + path.sep)) {
    throw new ApiError(400, "Bad document reference");
  }
  return full;
}

export async function saveDocument(
  file: unknown,
  meta: { title?: string; note?: string },
): Promise<DocumentRow | null> {
  if (!(file instanceof File) || file.size === 0) {
    throw new ApiError(400, "Choose a file to upload");
  }
  if (file.size > MAX_BYTES) {
    throw new ApiError(400, "That file is over the 25 MB limit");
  }

  const ext = path.extname(file.name).toLowerCase();
  // Both checks: browsers report the type inconsistently, and an extension on
  // its own is just text the uploader chose.
  if (!ALLOWED_EXT.has(ext) || !ALLOWED_MIME.has(file.type)) {
    throw new ApiError(
      400,
      "That file type is not allowed. PDF, Word, Excel, PowerPoint, ZIP, CSV, text and images are.",
    );
  }

  const storedName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fsp.writeFile(documentPath(storedName), buffer);

  try {
    const result = await execute(
      `INSERT INTO documents
         (title, original_name, stored_name, mime_type, size_bytes, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        (meta.title || file.name).slice(0, 200),
        file.name.slice(0, 255),
        storedName,
        file.type.slice(0, 120),
        file.size,
        meta.note?.slice(0, 500) || null,
      ],
    );
    return findDocument(result.insertId);
  } catch (error) {
    // The row failed, so the file on disk has nothing pointing at it.
    await fsp.unlink(documentPath(storedName)).catch(() => {});
    throw error;
  }
}

/** Removes the row and the file. A missing file is not an error. */
export async function deleteDocument(id: number): Promise<boolean> {
  const doc = await findDocument(id);
  if (!doc) return false;

  await execute("DELETE FROM documents WHERE id = ?", [id]);
  await fsp.unlink(documentPath(doc.stored_name)).catch(() => {});
  return true;
}
