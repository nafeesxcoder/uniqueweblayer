#!/usr/bin/env node
/**
 * Loads the existing portfolio projects into MySQL.
 *
 *   npm run seed
 *
 * Idempotent: a project whose slug already exists is skipped, so running it
 * twice will not duplicate anything.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_FILE = path.join(ROOT, "db", "seeds", "projects.json");

dotenv.config({ path: path.join(ROOT, ".env.local") });
dotenv.config({ path: path.join(ROOT, ".env") });

/** Same rules as app/lib/server/slug.ts — keep them in step. */
const slugify = (input) =>
  String(input || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 190);

async function run() {
  const projects = JSON.parse(await fs.readFile(SEED_FILE, "utf8"));

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "uniqueweblayer",
  });

  let inserted = 0;
  let skipped = 0;

  for (const p of projects) {
    const slug = slugify(p.title);
    const [existing] = await conn.execute(
      "SELECT id FROM projects WHERE slug = ? LIMIT 1",
      [slug],
    );
    if (existing.length > 0) {
      skipped += 1;
      continue;
    }

    await conn.execute(
      `INSERT INTO projects
         (title, slug, category, service_type, description, image, live_link,
          color, tags, client, country, result, featured, is_published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        p.title,
        slug,
        p.category,
        p.service_type,
        p.description,
        p.image || "",
        p.live_link || "",
        p.color || "#8b5cf6",
        JSON.stringify(p.tags || []),
        p.client || null,
        p.country || null,
        p.result || null,
        p.featured ? 1 : 0,
        p.sort_order ?? 0,
      ],
    );
    inserted += 1;
  }

  console.log(`✓ Seed complete — ${inserted} inserted, ${skipped} already present.`);
  await conn.end();
}

run().catch(async (err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
