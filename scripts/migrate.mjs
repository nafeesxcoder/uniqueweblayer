#!/usr/bin/env node
/**
 * Minimal SQL migration runner.
 *
 *   npm run migrate          → apply every pending migration
 *   npm run migrate:status   → list applied / pending migrations
 *
 * Runs outside Next, as a plain Node script, so it can be used from a cPanel
 * terminal or a deploy step without booting the whole app. It loads .env.local
 * itself for the same reason — Next is not here to do it.
 *
 * Migrations live in db/migrations as plain .sql files named
 * NNN_description.sql and run in filename order. Applied names are recorded in
 * `schema_migrations` so each file runs exactly once.
 *
 * Statements inside a file are split on `;` at end of line, so write one
 * statement per block and avoid stored procedures with inline semicolons.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MIGRATIONS_DIR = path.join(ROOT, "db", "migrations");

// Next reads .env.local first, then .env — match that order.
dotenv.config({ path: path.join(ROOT, ".env.local") });
dotenv.config({ path: path.join(ROOT, ".env") });

const DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number.parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "uniqueweblayer",
};

async function ensureDatabase() {
  const conn = await mysql.createConnection({
    host: DB.host,
    port: DB.port,
    user: DB.user,
    password: DB.password,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await conn.end();
}

const connectDb = () => mysql.createConnection(DB);

async function ensureMigrationsTable(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name       VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_migration_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function listMigrationFiles() {
  const files = await fs.readdir(MIGRATIONS_DIR);
  return files.filter((f) => f.endsWith(".sql")).sort();
}

async function appliedMigrations(conn) {
  const [rows] = await conn.query("SELECT name FROM schema_migrations");
  return new Set(rows.map((r) => r.name));
}

/** Split a .sql file into individual statements, ignoring comments. */
function splitStatements(sql) {
  return sql
    .split(/;\s*$/m)
    .map((s) =>
      s
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

async function up() {
  await ensureDatabase();
  const conn = await connectDb();
  await ensureMigrationsTable(conn);

  const files = await listMigrationFiles();
  const done = await appliedMigrations(conn);
  const pending = files.filter((f) => !done.has(f));

  if (pending.length === 0) {
    console.log("✓ Database is up to date — no pending migrations.");
    await conn.end();
    return;
  }

  for (const file of pending) {
    const sql = await fs.readFile(path.join(MIGRATIONS_DIR, file), "utf8");
    const statements = splitStatements(sql);
    console.log(`→ Applying ${file} (${statements.length} statements)`);
    try {
      await conn.beginTransaction();
      for (const statement of statements) await conn.query(statement);
      await conn.query("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
      await conn.commit();
      console.log(`  ✓ ${file}`);
    } catch (err) {
      await conn.rollback();
      console.error(`  ✗ ${file} failed: ${err.message}`);
      await conn.end();
      process.exit(1);
    }
  }

  console.log(`\n✓ Applied ${pending.length} migration(s).`);
  await conn.end();
}

async function status() {
  await ensureDatabase();
  const conn = await connectDb();
  await ensureMigrationsTable(conn);

  const files = await listMigrationFiles();
  const done = await appliedMigrations(conn);

  console.log(`\nDatabase: ${DB.database} @ ${DB.host}:${DB.port}\n`);
  for (const f of files) {
    console.log(`  ${done.has(f) ? "✓ applied" : "· pending"}   ${f}`);
  }
  console.log("");
  await conn.end();
}

const command = process.argv[2] || "up";
const run = command === "status" ? status : up;

run().catch((err) => {
  console.error("Migration error:", err.message);
  process.exit(1);
});
