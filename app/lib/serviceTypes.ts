/**
 * The seven service lines the company sells.
 *
 * These slugs are what `projects.service_type` stores and what the portfolio
 * filter bar sends. This used to be duplicated in the Express backend, with a
 * comment on each copy begging whoever edited one to remember the other.
 * Merging the API into this app removed the duplicate — there is now exactly
 * one list, imported by both the API routes and the UI.
 */
export const SERVICE_TYPES = [
  "web-development",
  "mobile-app",
  "software-development",
  "ui-ux-design",
  "digital-marketing",
  "ai-solution",
  "diy-tech",
] as const;

export type ServiceTypeSlug = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceTypeSlug, string> = {
  "web-development": "Web Development",
  "mobile-app": "Mobile App",
  "software-development": "Software Development",
  "ui-ux-design": "UI/UX Design",
  "digital-marketing": "Digital Marketing",
  "ai-solution": "AI Solutions",
  "diy-tech": "DIY Tech Projects",
};

export const isServiceType = (value: unknown): value is ServiceTypeSlug =>
  typeof value === "string" &&
  (SERVICE_TYPES as readonly string[]).includes(value);
