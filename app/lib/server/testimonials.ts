import "server-only";
import { query, queryOne, execute, type SqlParam } from "./db";

/**
 * Client quotes.
 *
 * A quote may point at a project, in which case the public card can show that
 * project's screenshot and link beside it. The join is a LEFT JOIN on purpose:
 * a quote whose project was deleted still has something worth showing.
 */

export interface Testimonial {
  id: number;
  author: string;
  role: string | null;
  company: string | null;
  quote: string;
  rating: number | null;
  project_id: number | null;
  is_published: 0 | 1;
  sort_order: number;
  created_at: string;
  updated_at: string;
  /** Joined from projects — present only when project_id is set. */
  project_title: string | null;
  project_slug: string | null;
  project_image: string | null;
  project_color: string | null;
  project_live_link: string | null;
}

const FIELDS = `
  t.id, t.author, t.role, t.company, t.quote, t.rating, t.project_id,
  t.is_published, t.sort_order, t.created_at, t.updated_at,
  p.title AS project_title, p.slug AS project_slug, p.image AS project_image,
  p.color AS project_color, p.live_link AS project_live_link
`;

/**
 * @param publishedOnly true for the public site, false for the admin list,
 * which has to show drafts or there would be no way to finish one.
 */
export async function listTestimonials(
  publishedOnly = true,
): Promise<Testimonial[]> {
  return query<Testimonial>(
    `SELECT ${FIELDS}
       FROM testimonials t
       LEFT JOIN projects p ON p.id = t.project_id
      ${publishedOnly ? "WHERE t.is_published = 1" : ""}
      ORDER BY t.sort_order ASC, t.created_at DESC`,
  );
}

export async function findTestimonial(id: number): Promise<Testimonial | null> {
  return queryOne<Testimonial>(
    `SELECT ${FIELDS}
       FROM testimonials t
       LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.id = ?
      LIMIT 1`,
    [id],
  );
}

export async function countTestimonials(): Promise<{
  total: number;
  published: number;
}> {
  const row = await queryOne<{ total: number; published: number | null }>(
    `SELECT COUNT(*) AS total, SUM(is_published = 1) AS published
       FROM testimonials`,
  );
  return {
    total: Number(row?.total || 0),
    published: Number(row?.published || 0),
  };
}

export interface TestimonialInput {
  author: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number | null;
  projectId?: number | null;
  isPublished?: boolean;
  sortOrder?: number;
}

export async function createTestimonial(
  data: TestimonialInput,
): Promise<Testimonial | null> {
  const result = await execute(
    `INSERT INTO testimonials
       (author, role, company, quote, rating, project_id, is_published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.author,
      data.role || null,
      data.company || null,
      data.quote,
      data.rating ?? null,
      data.projectId ?? null,
      data.isPublished === false ? 0 : 1,
      data.sortOrder ?? 0,
    ],
  );
  return findTestimonial(result.insertId);
}

/**
 * Partial update: only the keys present in `data` are written, so saving a
 * corrected name never blanks the quote.
 */
export async function updateTestimonial(
  id: number,
  data: Partial<TestimonialInput>,
): Promise<Testimonial | null> {
  const columns: Record<string, SqlParam> = {};

  if (data.author !== undefined) columns.author = data.author;
  if (data.role !== undefined) columns.role = data.role || null;
  if (data.company !== undefined) columns.company = data.company || null;
  if (data.quote !== undefined) columns.quote = data.quote;
  if (data.rating !== undefined) columns.rating = data.rating ?? null;
  if (data.projectId !== undefined) columns.project_id = data.projectId ?? null;
  if (data.isPublished !== undefined)
    columns.is_published = data.isPublished ? 1 : 0;
  if (data.sortOrder !== undefined) columns.sort_order = data.sortOrder;

  const keys = Object.keys(columns);
  if (keys.length === 0) return findTestimonial(id);

  await execute(
    `UPDATE testimonials SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
    [...keys.map((k) => columns[k]), id],
  );

  return findTestimonial(id);
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM testimonials WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
