import Script from "next/script";
import PortfolioClient from "./PortfolioClient";
import { pageMeta, breadcrumbSchema, jsonLd } from "../lib/seo";
import { SITE_URL } from "../data/site";
// Server component: query MySQL directly rather than fetching this app's own
// API over HTTP. The render already runs on the server, so a round trip back
// into itself would only add latency.
import { listProjects, forPublic, type Project } from "../lib/server/projects";

export const metadata = pageMeta({
  title: "Portfolio — Website, App, Software & AI Projects",
  description:
    "Portfolio of Unique Web Layer: business websites, e-commerce stores, SaaS platforms, React Native and Flutter apps, UI/UX design, digital marketing campaigns and AI solutions delivered for clients worldwide.",
  path: "/portfolio",
  keywords: [
    "web development portfolio",
    "mobile app development portfolio",
    "software development case studies",
    "ui ux design portfolio",
    "ai solutions case studies",
  ],
});

/** Re-render at most once a minute so a newly added project appears quickly. */
export const revalidate = 60;

export default async function PortfolioPage() {
  // If the database is down the page still renders; the client retries on mount.
  let projects: Project[] = [];
  try {
    projects = (await listProjects()).map(forPublic);
  } catch {
    projects = [];
  }

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Portfolio — Unique Web Layer",
    url: `${SITE_URL}/portfolio`,
    description:
      "Websites, mobile apps, software platforms, design, marketing and AI projects delivered by Unique Web Layer for clients worldwide.",
    hasPart: projects
      .filter((p) => p.liveLink && p.liveLink !== "#")
      .map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        description: p.description,
        url: p.liveLink,
        keywords: p.tags.join(", "),
        creator: { "@id": `${SITE_URL}/#organization` },
      })),
  };

  return (
    <>
      <Script
        id="portfolio-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(portfolioSchema)}
      />
      <Script
        id="portfolio-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
          ]),
        )}
      />
      <PortfolioClient initialProjects={projects} />
    </>
  );
}
