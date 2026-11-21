/** Shapes shared by the server, the public product pages and the admin form. */

export type ProductStatus = "live" | "beta" | "coming-soon";

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  live: "Live",
  beta: "Beta",
  "coming-soon": "Coming soon",
};

export interface ProductItem {
  title: string;
  text: string;
}

export interface ProductPlan {
  name: string;
  price: string;
  note: string;
  items: string[];
}

export interface ProductContent {
  highlights: { value: string; label: string }[];
  problems: ProductItem[];
  features: ProductItem[];
  steps: ProductItem[];
  audience: string[];
  plans: ProductPlan[];
  faqs: { question: string; answer: string }[];
}

export interface ProductShot {
  src: string;
  caption: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  summary: string;
  description: string;
  status: ProductStatus;
  websiteUrl: string;
  androidUrl: string;
  iosUrl: string;
  ctaLabel: string;
  brandColor: string;
  accentColor: string;
  logo: string;
  heroImage: string;
  gallery: ProductShot[];
  content: ProductContent;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

export const EMPTY_PRODUCT_CONTENT: ProductContent = {
  highlights: [],
  problems: [],
  features: [],
  steps: [],
  audience: [],
  plans: [],
  faqs: [],
};
