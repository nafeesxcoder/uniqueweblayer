import "server-only";
import crypto from "node:crypto";
import { queryOne, execute } from "./db";
import { env } from "./env";

/**
 * The admin account.
 *
 * The password used to live only in .env.local, so changing it meant editing a
 * file on the server. It now lives here as a scrypt hash, which makes two
 * things possible: changing it from the settings page, and resetting it over
 * email when it is forgotten.
 *
 * Nothing changes for an existing install. The first sign-in after this
 * migration seeds the row from ADMIN_PASSWORD, so the password you already use
 * keeps working until you choose a new one. After that the database wins and
 * the .env value is ignored — otherwise a changed password would silently
 * revert whenever someone re-read the env file.
 *
 * Hashing is scrypt from node's own crypto. It is deliberately slow and salted
 * per account, so the stored value is useless to anyone who reads the table,
 * and it needs no extra dependency.
 */

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = 16384; // 2^14 — ~100ms per hash on a small VPS
const RESET_TTL_MS = 30 * 60 * 1000;

export interface AdminAccount {
  id: number;
  email: string;
  password_hash: string;
  password_changed_at: string | null;
  last_login_at: string | null;
  reset_token_hash: string | null;
  reset_expires_at: string | null;
  reset_requested_at: string | null;
  created_at: string;
}

/* ------------------------------- hashing -------------------------------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto
    .scryptSync(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_COST })
    .toString("hex");
  return `scrypt$${SCRYPT_COST}$${salt}$${key}`;
}

/**
 * Compares in constant time, so a wrong password cannot be narrowed down by
 * how long the answer takes.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;

  const cost = Number(parts[1]);
  if (!Number.isInteger(cost) || cost < 1024) return false;

  try {
    const expected = Buffer.from(parts[3], "hex");
    const actual = crypto.scryptSync(password, parts[2], expected.length, {
      N: cost,
    });
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/* -------------------------------- reading ------------------------------- */

export async function findAdminAccount(): Promise<AdminAccount | null> {
  return queryOne<AdminAccount>("SELECT * FROM admin_account WHERE id = 1");
}

/**
 * Returns the account, creating it from .env.local on first use.
 *
 * Null means the server has no password configured at all — neither in the
 * database nor in the environment — and login must refuse rather than let
 * anyone in.
 */
export async function getOrSeedAdminAccount(): Promise<AdminAccount | null> {
  const existing = await findAdminAccount();
  if (existing) return existing;

  if (!env.admin.password) return null;

  await execute(
    `INSERT INTO admin_account (id, email, password_hash)
     VALUES (1, ?, ?)
     ON DUPLICATE KEY UPDATE id = id`,
    [env.admin.email, hashPassword(env.admin.password)],
  );

  return findAdminAccount();
}

export async function markLogin(): Promise<void> {
  await execute(
    "UPDATE admin_account SET last_login_at = CURRENT_TIMESTAMP WHERE id = 1",
  );
}

/* ------------------------------ changing -------------------------------- */

/** Sets a new password and clears any outstanding reset link. */
export async function setPassword(password: string): Promise<void> {
  await execute(
    `UPDATE admin_account
        SET password_hash       = ?,
            password_changed_at = CURRENT_TIMESTAMP,
            reset_token_hash    = NULL,
            reset_expires_at    = NULL
      WHERE id = 1`,
    [hashPassword(password)],
  );
}

/* ------------------------------- resetting ------------------------------ */

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

/**
 * Issues a reset token and stores only its hash.
 *
 * The token goes out in the email and is never written down here, so someone
 * who can read this table still cannot reset the password. It expires in 30
 * minutes and any earlier token stops working the moment a new one is issued.
 */
export async function createResetToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + RESET_TTL_MS);

  await execute(
    `UPDATE admin_account
        SET reset_token_hash   = ?,
            reset_expires_at   = ?,
            reset_requested_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
    [sha256(token), expires],
  );

  return token;
}

/**
 * Exchanges a reset token for a new password.
 *
 * Returns false for a token that is wrong, already used or past its half hour;
 * the caller reports all three the same way, so a guess learns nothing.
 */
export async function consumeResetToken(
  token: string,
  newPassword: string,
): Promise<boolean> {
  const account = await findAdminAccount();
  if (!account?.reset_token_hash || !account.reset_expires_at) return false;

  if (new Date(account.reset_expires_at.replace(" ", "T")) < new Date()) {
    return false;
  }

  const given = Buffer.from(sha256(token));
  const stored = Buffer.from(account.reset_token_hash);
  if (given.length !== stored.length || !crypto.timingSafeEqual(given, stored)) {
    return false;
  }

  await setPassword(newPassword);
  return true;
}

/**
 * How recently a reset was asked for. Used to refuse a flood of reset emails
 * even when the request comes from a different address each time.
 */
export async function lastResetRequestAge(): Promise<number | null> {
  const account = await findAdminAccount();
  if (!account?.reset_requested_at) return null;
  return (
    Date.now() - new Date(account.reset_requested_at.replace(" ", "T")).getTime()
  );
}
