import "server-only";
import { query, queryOne, execute, type SqlParam } from "./db";
import { uniqueSlug } from "./slug";
import type { ServiceTypeSlug } from "../serviceTypes";
import type { CreateProjectInput, UpdateProjectInput } from "./validation";

/**
 * All SQL for the `projects` table.
 *
 * Server components import these directly instead of fetching their own API
 * over HTTP — the page already runs on the server, so a round trip back into
 * itself would just add latency. The /api routes call the same functions, so
 * the browser and the server never see different data.
 */

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  type: ServiceTypeSlug;
  description: string;
  image: string;
  liveLink: string;
  color: string;
  tags: string[];
  client?: string;
  /** Stored for SEO and reporting — never sent to the public site. */
  country?: string;
  result?: string;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

type Row = {
  id: number;
  title: string;
  slug: string;
  category: string;
  service_type: ServiceTypeSlug;
  description: string;
  image: string;
  live_link: string;
  color: string;
  tags: string | string[] | null;
  client: string | null;
  country: string | null;
  result: string | null;
  featured: number;
  is_published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const COLUMNS = `
  id, title, slug, category, service_type, description, image, live_link,
  color, tags, client, country, result, featured, is_published, sort_order,
  created_at, updated_at
`;

function toProject(row: Row): Project {
  let tags = row.tags;
  if (typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = [];
    }
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    type: row.service_type,
    description: row.description,
    // Uploads live under /uploads, seeded screenshots under /. Both are served
    // by this same app, so a relative path is all the browser needs — there is
    // no separate API origin to prefix any more.
    image: row.image || "",
    liveLink: row.live_link || "",
    color: row.color,
    tags: Array.isArray(tags) ? tags : [],
    client: row.client || undefined,
    country: row.country || undefined,
    result: row.result || undefined,
    featured: Boolean(row.featured),
    isPublished: Boolean(row.is_published),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Strips `country` for anyone who is not signed in as admin. */
export const forPublic = (project: Project): Project => {
  const { country, ...rest } = project; // eslint-disable-line @typescript-eslint/no-unused-vars
  return rest as Project;
};

export async function slugExists(slug: string): Promise<boolean> {
  const row = await queryOne("SELECT id FROM projects WHERE slug = ? LIMIT 1", [
    slug,
  ]);
  return row !== null;
}

export async function listProjects({
  type,
  featured,
  includeUnpublished = false,
}: {
  type?: string;
  featured?: boolean;
  includeUnpublished?: boolean;
} = {}): Promise<Project[]> {
  const where: string[] = [];
  const params: SqlParam[] = [];

  if (!includeUnpublished) where.push("is_published = 1");
  if (type && type !== "all") {
    where.push("service_type = ?");
    params.push(type);
  }
  if (featured) where.push("featured = 1");

  const rows = await query<Row>(
    `SELECT ${COLUMNS} FROM projects
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY sort_order ASC, created_at DESC, id DESC`,
    params,
  );
  return rows.map(toProject);
}

export async function countByType({
  includeUnpublished = false,
}: { includeUnpublished?: boolean } = {}): Promise<Record<string, number>> {
  const rows = await query<{ service_type: string; total: number }>(
    `SELECT service_type, COUNT(*) AS total
       FROM projects
      ${includeUnpublished ? "" : "WHERE is_published = 1"}
      GROUP BY service_type`,
  );

  const counts: Record<string, number> = { all: 0 };
  for (const row of rows) {
    counts[row.service_type] = Number(row.total);
    counts.all += Number(row.total);
  }
  return counts;
}

export async function findProject(
  idOrSlug: string | number,
): Promise<Project | null> {
  const byId = /^\d+$/.test(String(idOrSlug));
  const row = await queryOne<Row>(
    `SELECT ${COLUMNS} FROM projects WHERE ${byId ? "id" : "slug"} = ? LIMIT 1`,
    [idOrSlug],
  );
  return row ? toProject(row) : null;
}

export async function createProject(
  data: CreateProjectInput,
): Promise<Project | null> {
  const slug = await uniqueSlug(data.title, slugExists);

  const result = await execute(
    `INSERT INTO projects
       (title, slug, category, service_type, description, image, live_link,
        color, tags, client, country, result, featured, is_published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      slug,
      data.category,
      data.type,
      data.description,
      data.image || "",
      data.liveLink || "",
      data.color || "#8b5cf6",
      JSON.stringify(data.tags || []),
      data.client || null,
      data.country || null,
      data.result || null,
      data.featured ? 1 : 0,
      data.isPublished === false ? 0 : 1,
      data.sortOrder ?? 0,
    ],
  );

  return findProject(result.insertId);
}

const UPDATABLE: Record<string, string> = {
  title: "title",
  category: "category",
  type: "service_type",
  description: "description",
  image: "image",
  liveLink: "live_link",
  color: "color",
  client: "client",
  country: "country",
  result: "result",
  sortOrder: "sort_order",
};

/** Columns where an empty string means "clear it", not "store an empty string". */
const NULLABLE = new Set(["client", "country", "result"]);

export async function updateProject(
  id: number,
  data: UpdateProjectInput,
): Promise<Project | null> {
  const sets: string[] = [];
  const params: SqlParam[] = [];
  const input = data as Record<string, unknown>;

  for (const [key, column] of Object.entries(UPDATABLE)) {
    const value = input[key];
    if (value === undefined) continue;

    sets.push(`${column} = ?`);
    // Zod has already validated these to strings/numbers; the cast just tells
    // TypeScript what the generic Record lost.
    params.push(
      value === "" && NULLABLE.has(key) ? null : (value as SqlParam),
    );
  }

  if (data.tags !== undefined) {
    sets.push("tags = ?");
    params.push(JSON.stringify(data.tags || []));
  }
  if (data.featured !== undefined) {
    sets.push("featured = ?");
    params.push(data.featured ? 1 : 0);
  }
  if (data.isPublished !== undefined) {
    sets.push("is_published = ?");
    params.push(data.isPublished ? 1 : 0);
  }
  if (data.title !== undefined) {
    sets.push("slug = ?");
    params.push(
      await uniqueSlug(data.title, async (candidate) => {
        const row = await queryOne(
          "SELECT id FROM projects WHERE slug = ? AND id <> ? LIMIT 1",
          [candidate, id],
        );
        return row !== null;
      }),
    );
  }

  if (sets.length === 0) return findProject(id);

  params.push(id);
  await execute(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`, params);
  return findProject(id);
}

export async function deleteProject(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM projects WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
