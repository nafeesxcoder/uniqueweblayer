import "server-only";
import mysql from "mysql2/promise";
import { env } from "./env";

/**
 * Shared MySQL pool.
 *
 * In development Next hot-reloads modules on every edit, which would create a
 * new pool each time and exhaust MySQL's connection limit within minutes. The
 * pool is cached on globalThis so reloads reuse the same one.
 */
declare global {
  // eslint-disable-next-line no-var
  var __uwlPool: mysql.Pool | undefined;
}

function createPool() {
  return mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    waitForConnections: true,
    connectionLimit: env.db.connectionLimit,
    queueLimit: 0,
    charset: "utf8mb4_general_ci",
    // Dates come back as strings so they serialise cleanly to the client.
    dateStrings: true,
  });
}

export const pool: mysql.Pool = global.__uwlPool ?? createPool();
if (!env.isProd) global.__uwlPool = pool;

/**
 * Values a prepared statement can carry. mysql2's own ExecuteValues type is
 * narrower than `unknown[]`, so the call sites declare this instead of casting.
 */
export type SqlParam = string | number | boolean | null | Date | Buffer;

/** Run a parameterised query and return the rows. */
export async function query<T = any>(
  sql: string,
  params: SqlParam[] = [],
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

/** Single-row helper. */
export async function queryOne<T = any>(
  sql: string,
  params: SqlParam[] = [],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/** INSERT/UPDATE/DELETE — returns the driver's result header. */
export async function execute(
  sql: string,
  params: SqlParam[] = [],
): Promise<mysql.ResultSetHeader> {
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
}
