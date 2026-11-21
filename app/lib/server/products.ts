import "server-only";
import { query, queryOne, execute, type SqlParam } from "./db";
import { uniqueSlug } from "./slug";
import {
  EMPTY_PRODUCT_CONTENT,
  type Product,
  type ProductContent,
  type ProductShot,
  type ProductStatus,
} from "../productTypes";

/**
 * Our own products. Client work stays in `projects`; these are managed from
 * /admin/products and shown on /products.
 */

interface ProductRow {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  summary: string;
  description: string;
  status: string;
  website_url: string | null;
  android_url: string | null;
  ios_url: string | null;
  cta_label: string;
  brand_color: string;
  accent_color: string;
  logo: string | null;
  hero_image: string | null;
  gallery: string;
  content: string;
  is_published: number;
  sort_order: number;
  updated_at: string;
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    category: row.category,
    summary: row.summary,
    description: row.description,
    status: row.status as ProductStatus,
    websiteUrl: row.website_url || "",
    androidUrl: row.android_url || "",
    iosUrl: row.ios_url || "",
    ctaLabel: row.cta_label,
    brandColor: row.brand_color,
    accentColor: row.accent_color,
    logo: row.logo || "",
    heroImage: row.hero_image || "",
    gallery: parseJson<ProductShot[]>(row.gallery, []),
    content: {
      ...EMPTY_PRODUCT_CONTENT,
      ...parseJson<Partial<ProductContent>>(row.content, {}),
    },
    isPublished: row.is_published === 1,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export async function listProducts(includeHidden = false): Promise<Product[]> {
  const rows = await query<ProductRow>(
    `SELECT * FROM products
      ${includeHidden ? "" : "WHERE is_published = 1"}
      ORDER BY sort_order ASC, id ASC`,
  );
  return rows.map(toProduct);
}

export async function findPublishedProduct(slug: string): Promise<Product | null> {
  const row = await queryOne<ProductRow>(
    "SELECT * FROM products WHERE slug = ? AND is_published = 1 LIMIT 1",
    [slug],
  );
  return row ? toProduct(row) : null;
}

export async function findProductById(id: number): Promise<Product | null> {
  const row = await queryOne<ProductRow>(
    "SELECT * FROM products WHERE id = ? LIMIT 1",
    [id],
  );
  return row ? toProduct(row) : null;
}

export type ProductInput = Omit<Product, "id" | "slug" | "updatedAt">;

const COLUMN: Record<keyof ProductInput, string> = {
  name: "name",
  tagline: "tagline",
  category: "category",
  summary: "summary",
  description: "description",
  status: "status",
  websiteUrl: "website_url",
  androidUrl: "android_url",
  iosUrl: "ios_url",
  ctaLabel: "cta_label",
  brandColor: "brand_color",
  accentColor: "accent_color",
  logo: "logo",
  heroImage: "hero_image",
  gallery: "gallery",
  content: "content",
  isPublished: "is_published",
  sortOrder: "sort_order",
};

const NULLABLE = new Set<keyof ProductInput>([
  "websiteUrl",
  "androidUrl",
  "iosUrl",
  "logo",
  "heroImage",
]);

function toColumnValue(key: keyof ProductInput, value: unknown): SqlParam {
  if (key === "gallery" || key === "content") return JSON.stringify(value);
  if (key === "isPublished") return value ? 1 : 0;
  if (NULLABLE.has(key)) return (value as string) || null;
  return value as SqlParam;
}

export async function createProduct(data: ProductInput): Promise<Product | null> {
  const slug = await uniqueSlug(data.name, async (candidate) =>
    Boolean(
      await queryOne("SELECT id FROM products WHERE slug = ? LIMIT 1", [candidate]),
    ),
  );
  const keys = Object.keys(COLUMN) as (keyof ProductInput)[];
  const result = await execute(
    `INSERT INTO products (slug, ${keys.map((k) => COLUMN[k]).join(", ")})
     VALUES (?, ${keys.map(() => "?").join(", ")})`,
    [slug, ...keys.map((k) => toColumnValue(k, data[k]))],
  );
  return findProductById(result.insertId);
}

/** Only the keys present are written. The slug never changes, so links stay valid. */
export async function updateProduct(
  id: number,
  data: Partial<ProductInput>,
): Promise<Product | null> {
  const keys = (Object.keys(COLUMN) as (keyof ProductInput)[]).filter(
    (k) => data[k] !== undefined,
  );
  if (keys.length > 0) {
    await execute(
      `UPDATE products SET ${keys.map((k) => `${COLUMN[k]} = ?`).join(", ")} WHERE id = ?`,
      [...keys.map((k) => toColumnValue(k, data[k])), id],
    );
  }
  return findProductById(id);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
