import "server-only";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "./env";

/**
 * Admin auth.
 *
 * There is no users table on purpose — one admin password lives in .env.local.
 * Logging in exchanges it for a signed JWT; write routes require that JWT.
 */

export type AdminClaims = { sub: string; email: string };

export function issueToken(email = env.admin.email): string {
  if (!env.admin.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ sub: "admin", email }, env.admin.jwtSecret, {
    expiresIn: env.admin.jwtExpiresIn,
  } as jwt.SignOptions);
}

/** Constant-time compare, so the password can't be guessed by timing. */
export function sameSecret(a: string, b: string): boolean {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Reads the Bearer token off a request and verifies it. Null when absent or invalid. */
export function readAdmin(request: Request): AdminClaims | null {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || !env.admin.jwtSecret) return null;

  try {
    const claims = jwt.verify(token, env.admin.jwtSecret) as AdminClaims;
    // A short-lived file link token is signed with the same secret — it must
    // never count as an admin session.
    if (claims.sub !== "admin") return null;
    return claims;
  } catch {
    return null;
  }
}

/**
 * Short-lived token for one document, put in a URL.
 *
 * Phones cannot show a blob: URL in their native PDF/Office viewer, and a plain
 * link cannot carry the Authorization header. So the admin asks for a link that
 * works for a few minutes, for one file only, and the phone opens that.
 */
const FILE_AUDIENCE = "document-file";

export function issueFileToken(docId: number): string {
  if (!env.admin.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ sub: "file", doc: docId }, env.admin.jwtSecret, {
    expiresIn: "5m",
    audience: FILE_AUDIENCE,
  });
}

export function verifyFileToken(token: string, docId: number): boolean {
  if (!token || !env.admin.jwtSecret) return false;
  try {
    const claims = jwt.verify(token, env.admin.jwtSecret, {
      audience: FILE_AUDIENCE,
    }) as { sub?: string; doc?: number };
    return claims.sub === "file" && claims.doc === docId;
  } catch {
    return false;
  }
}

/**
 * True when a sign-in is possible at all.
 *
 * The password itself now lives in the admin_account table — ADMIN_PASSWORD is
 * only the seed for the very first sign-in — so this checks the one thing that
 * is still required from the environment either way.
 */
export const isAdminConfigured = () => Boolean(env.admin.jwtSecret);
