import { MetadataRoute } from "next";
import { SITE_URL } from "./data/site";
import { services } from "./data/services";
import { countries } from "./data/countries";
import { listProjects } from "./lib/server/projects";

/**
 * Regenerated hourly so a project added through the Add Project button shows
 * up in the sitemap without a redeploy.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/process", priority: 0.7, changeFrequency: "monthly" as const },
    {
      path: "/technologies",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    {
      path: "/web-development-company",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
  ].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const countryRoutes = countries.map((c) => ({
    url: `${SITE_URL}/web-development-company/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /**
   * One entry per portfolio project. `lastModified` uses the row's real
   * updated_at, so an edited case study signals freshness honestly instead of
   * every URL claiming it changed today.
   */
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await listProjects();
    projectRoutes = projects.map((p) => ({
      url: `${SITE_URL}/portfolio/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Database unreachable — ship the rest of the sitemap rather than failing.
    projectRoutes = [];
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...countryRoutes,
  ];
}
