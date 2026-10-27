import { services } from "../data/services";

/**
 * The price list, as written in code.
 *
 * This is the fallback for every service. Anything changed in the admin panel
 * is stored in the `service_pricing` table and wins over what is here, so this
 * file only has to be right the day a new service is added.
 *
 * Safe to import from the browser — it is plain data, no database.
 */

export interface Pricing {
  price: string;
  delivery: string;
}

export const DEFAULT_PRICING: Record<string, Pricing> = Object.fromEntries(
  services.map((s) => [s.slug, { price: s.price, delivery: s.delivery }]),
);

export const defaultPricing = (slug: string): Pricing =>
  DEFAULT_PRICING[slug] ?? { price: "On request", delivery: "Ask us" };

/** Shape returned by /api/pricing — defaults already merged with overrides. */
export interface ServicePrice extends Pricing {
  slug: string;
  name: string;
  category: string;
  /** True when this one was changed in the admin panel. */
  isCustom: boolean;
}
