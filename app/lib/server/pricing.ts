import "server-only";
import { query, execute } from "./db";
import { services } from "../../data/services";
import { defaultPricing, type Pricing, type ServicePrice } from "../pricing";

/**
 * Price overrides.
 *
 * Reading is one small query returning at most a couple of dozen rows, so it
 * is fetched whole and merged in memory rather than joined per page.
 */

interface PricingRow {
  slug: string;
  price: string;
  delivery: string;
  updated_at: string;
}

/**
 * A price is never worth failing over.
 *
 * These run while the pages are being pre-rendered, so a database that is not
 * up yet — which is normal during a deploy, and on a host where the build
 * cannot reach MySQL at all — used to kill the whole build with ECONNREFUSED.
 * Falling back to the prices written in the code means the site builds and
 * ships either way; the saved prices appear on the next revalidation once the
 * database is reachable.
 */
async function safely<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.warn(
      "Pricing: using the defaults from data/services.ts —",
      (error as Error).message,
    );
    return fallback;
  }
}

async function overrides(): Promise<Map<string, PricingRow>> {
  const rows = await safely(
    () =>
      query<PricingRow>(
        "SELECT slug, price, delivery, updated_at FROM service_pricing",
      ),
    [] as PricingRow[],
  );
  return new Map(rows.map((r) => [r.slug, r]));
}

/** Every service with its current price — the list the admin screen shows. */
export async function listServicePrices(): Promise<ServicePrice[]> {
  const custom = await overrides();

  return services.map((service) => {
    const row = custom.get(service.slug);
    return {
      slug: service.slug,
      name: service.name,
      category: service.category,
      price: row?.price ?? service.price,
      delivery: row?.delivery ?? service.delivery,
      isCustom: Boolean(row),
    };
  });
}

/** One service's current price, for its own page. */
export async function getServicePricing(slug: string): Promise<Pricing> {
  const rows = await safely(
    () =>
      query<PricingRow>(
        "SELECT slug, price, delivery, updated_at FROM service_pricing WHERE slug = ? LIMIT 1",
        [slug],
      ),
    [] as PricingRow[],
  );
  const row = rows[0];
  if (row) {
    return { price: row.price, delivery: row.delivery };
  }
  return defaultPricing(slug);
}

export const isKnownService = (slug: string) =>
  services.some((s) => s.slug === slug);

export async function setServicePricing(
  slug: string,
  data: { price: string; delivery: string },
): Promise<void> {
  await execute(
    `INSERT INTO service_pricing (slug, price, delivery)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE price = VALUES(price),
                             delivery = VALUES(delivery)`,
    [slug, data.price, data.delivery],
  );
}

/** Drops the override, so the price in data/services.ts applies again. */
export async function resetServicePricing(slug: string): Promise<boolean> {
  const result = await execute("DELETE FROM service_pricing WHERE slug = ?", [
    slug,
  ]);
  return result.affectedRows > 0;
}

