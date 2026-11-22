import "server-only";
import { queryOne, execute } from "./db";
import { defaultTerms, type TermsContent } from "../../data/projectTerms";

/**
 * The project terms as they are currently published.
 *
 * Reads the saved copy from `site_documents` and falls back to the built-in
 * defaults, so the page still renders if the database is unreachable.
 */

const SLUG = "project-terms";

export async function getTerms(): Promise<TermsContent> {
  try {
    const row = await queryOne<{ content: string }>(
      "SELECT content FROM site_documents WHERE slug = ? LIMIT 1",
      [SLUG],
    );
    if (!row) return defaultTerms;
    const saved = JSON.parse(row.content) as Partial<TermsContent>;
    return { ...defaultTerms, ...saved };
  } catch {
    return defaultTerms;
  }
}

export async function saveTerms(content: TermsContent): Promise<TermsContent> {
  await execute(
    `INSERT INTO site_documents (slug, content) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE content = VALUES(content)`,
    [SLUG, JSON.stringify(content)],
  );
  return getTerms();
}
