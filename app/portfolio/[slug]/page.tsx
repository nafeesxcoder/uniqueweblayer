import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Stars } from "../../components/Stars";
import { pageMeta, breadcrumbSchema, jsonLd } from "../../lib/seo";
import { SITE_URL, company } from "../../data/site";
import { serviceLines } from "../../data/services";
// Server component — direct database access, no HTTP hop. See portfolio/page.tsx.
import {
  findProject,
  listProjects,
  forPublic,
  type Project,
} from "../../lib/server/projects";

/**
 * One indexable page per portfolio project.
 *
 * Before this existed, ten real client builds lived only as cards inside a
 * single /portfolio page, so Google had one URL to rank for all of them.
 * Each project now has its own URL, title, description and CreativeWork
 * schema — which is what lets a search like "restaurant website developer"
 * land on the matching case study instead of a generic listing.
 *
 * Pages are generated from the database, so adding a project through the
 * Add Project button creates a new indexable page with no code change.
 */

export const revalidate = 300;
/** A project added after the build still renders, on demand. */
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const projects = await listProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    // Database unreachable at build time — pages render on first request.
    return [];
  }
}

const lineLabel = (type: string) =>
  serviceLines.find((l) => l.slug === type)?.category ?? "Project";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await findProject(slug);

  if (!project) {
    return pageMeta({
      title: "Project not found",
      description: "This portfolio project is no longer available.",
      path: `/portfolio/${slug}`,
    });
  }

  const label = lineLabel(project.type);

  return {
    ...pageMeta({
      title: `${project.title} — ${project.category} ${label} Case Study`,
      description: project.description.slice(0, 155),
      path: `/portfolio/${project.slug}`,
      keywords: [
        `${project.category.toLowerCase()} case study`,
        `${label.toLowerCase()} project`,
        ...project.tags.map((t) => `${t} development`),
      ],
      image: project.image || "/og/default.jpg",
    }),
    openGraph: {
      title: `${project.title} — ${project.category}`,
      description: project.description,
      url: `${SITE_URL}/portfolio/${project.slug}`,
      siteName: company.name,
      type: "article",
      images: [
        {
          url: project.image || "/og/default.jpg",
          alt: `${project.title} — ${project.category} project by ${company.name}`,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await findProject(slug);

  if (!project) notFound();

  // Related work: same service line, excluding this one.
  let related: Project[] = [];
  try {
    const all = (await listProjects({ type: project.type })).map(forPublic);
    related = all.filter((p) => p.slug !== project.slug).slice(0, 3);
  } catch {
    related = [];
  }

  const label = lineLabel(project.type);
  const hasLink = Boolean(project.liveLink && project.liveLink !== "#");

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/portfolio/${project.slug}#project`,
    name: project.title,
    headline: `${project.title} — ${project.category}`,
    description: project.description,
    url: `${SITE_URL}/portfolio/${project.slug}`,
    ...(hasLink ? { sameAs: project.liveLink } : {}),
    ...(project.image ? { image: project.image } : {}),
    keywords: project.tags.join(", "),
    genre: label,
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    creator: { "@id": `${SITE_URL}/#organization` },
    provider: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <Script
        id={`project-schema-${project.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(projectSchema)}
      />
      <Script
        id={`project-breadcrumb-${project.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path: `/portfolio/${project.slug}` },
          ]),
        )}
      />

      <main className="min-h-screen bg-black">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-black" />
          <Stars />

          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb trail — real links, crawlable */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-xs text-gray-500"
            >
              <Link href="/" className="transition-colors hover:text-purple-300">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/portfolio"
                className="transition-colors hover:text-purple-300"
              >
                Portfolio
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-gray-400">{project.title}</span>
            </nav>

            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
              style={{
                borderColor: `${project.color}55`,
                backgroundColor: `${project.color}1a`,
                color: project.color,
              }}
            >
              {label}
            </div>

            <h1 className="bg-linear-to-r from-white to-purple-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              {project.title}
            </h1>

            <p
              className="mt-3 text-sm font-semibold"
              style={{ color: project.color }}
            >
              {project.category}
            </p>

            {/* Screenshot */}
            {project.image && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-purple-500/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.category} ${label.toLowerCase()} built by ${company.name}`}
                  width={1200}
                  height={700}
                  className="w-full object-cover"
                />
              </div>
            )}

            <div className="mt-10 grid gap-10 md:grid-cols-[1fr_280px]">
              {/* Body */}
              <div>
                <h2 className="text-xl font-bold text-white">
                  About this project
                </h2>
                <p className="mt-3 text-base leading-relaxed text-gray-300">
                  {project.description}
                </p>

                {project.result && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                    <span className="text-sm text-emerald-200">
                      {project.result}
                    </span>
                  </div>
                )}

                {hasLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition hover:brightness-125"
                    style={{
                      backgroundColor: `${project.color}20`,
                      color: project.color,
                    }}
                  >
                    Visit the live site
                  </a>
                )}
              </div>

              {/* Sidebar facts */}
              <aside className="space-y-6">
                {project.tags.length > 0 && (
                  <div className="uwl-panel rounded-2xl border p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Built with
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2.5 py-1 text-[11px] text-gray-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="uwl-panel rounded-2xl border p-5">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Service line
                  </h2>
                  <Link
                    href={`/services`}
                    className="text-sm text-purple-300 transition-colors hover:text-purple-200"
                  >
                    {label}
                  </Link>
                  {project.client && (
                    <>
                      <h2 className="mb-1 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Client
                      </h2>
                      <p className="text-sm text-gray-300">{project.client}</p>
                    </>
                  )}
                </div>
              </aside>
            </div>

            {/* Related work — internal links Google can follow */}
            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="mb-5 text-xl font-bold text-white">
                  More {label.toLowerCase()} work
                </h2>
                <div className="grid gap-5 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/portfolio/${r.slug}`}
                      className="group rounded-2xl border border-purple-500/25 bg-linear-to-br from-purple-900/30 to-black/40 p-5 transition hover:border-purple-500/60"
                    >
                      <div
                        className="text-[11px] font-semibold"
                        style={{ color: r.color }}
                      >
                        {r.category}
                      </div>
                      <div className="mt-1 font-semibold text-white transition-colors group-hover:text-purple-300">
                        {r.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 text-center sm:p-12">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Want something like this?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400 md:text-base">
                Tell us what you are building and you get a fixed quote, a scope
                document and a delivery date — usually within one working day.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/contact">
                  <button className="w-full rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 sm:w-auto">
                    Start a Project
                  </button>
                </Link>
                <Link href="/portfolio">
                  <button className="w-full rounded-full border border-purple-400/50 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-600/10 sm:w-auto">
                    Back to Portfolio
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
