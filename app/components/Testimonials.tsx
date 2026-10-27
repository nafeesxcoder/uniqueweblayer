"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { Stars } from "./Stars";
import {
  fetchProjects,
  fetchTestimonials,
  type ApiProject,
  type ApiTestimonial,
} from "../lib/api";
import { serviceLines } from "../data/services";

/**
 * CLIENT WORK
 * ------------------------------------------------------------------
 * This section once showed invented people ("Sarah Johnson, Bloom Cosmetics"),
 * invented results and a "VERIFIED CLIENT" badge on every card. Those are
 * fabricated endorsements: easy for a prospect to check, and in the US market
 * they fall under the FTC rule on fake reviews.
 *
 * Everything here now comes from the database, so it cannot drift from what
 * was actually delivered or actually said:
 *
 *   • real client quotes, added from /admin/testimonials
 *   • real projects, added from /admin/projects
 *
 * A quote linked to a project shows beside that project's screenshot, with a
 * link to the live site — the visitor can go and check it. Quotes come first,
 * then the remaining projects described in your own words, which is honest and
 * still persuasive when no quote exists yet.
 */

type Slide =
  | { kind: "quote"; quote: ApiTestimonial; project?: ApiProject }
  | { kind: "project"; project: ApiProject };

const ACCENTS = [
  "from-purple-500 via-violet-500 to-indigo-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-pink-500 via-rose-500 to-red-500",
];

const lineLabel = (type: string) =>
  serviceLines.find((l) => l.slug === type)?.category ?? "Project";

const initials = (value: string) =>
  value
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase() || "UW";

export default function Testimonials() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [quotes, setQuotes] = useState<ApiTestimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // Both lists are public reads; one failing should not blank the section.
    void Promise.allSettled([fetchProjects(), fetchTestimonials()]).then(
      ([projectResult, quoteResult]) => {
        if (cancelled) return;
        if (projectResult.status === "fulfilled") {
          setProjects(projectResult.value.slice(0, 8));
        }
        if (quoteResult.status === "fulfilled") {
          setQuotes(quoteResult.value);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Quotes first, then any project that does not already have one — otherwise
   * the same project would appear twice, once with the quote and once without.
   */
  const slides: Slide[] = useMemo(() => {
    const byId = new Map(projects.map((p) => [p.id, p]));
    const spokenFor = new Set(
      quotes.map((q) => q.project_id).filter((id): id is number => id !== null),
    );

    return [
      ...quotes.map(
        (quote): Slide => ({
          kind: "quote",
          quote,
          project: quote.project_id ? byId.get(quote.project_id) : undefined,
        }),
      ),
      ...projects
        .filter((p) => !spokenFor.has(p.id))
        .map((project): Slide => ({ kind: "project", project })),
    ];
  }, [projects, quotes]);

  // Auto-advance, but stop if there is only one card.
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % slides.length),
      7000,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  // Nothing to show yet — render nothing rather than an empty shell.
  if (slides.length === 0) return null;

  const index = Math.min(activeIndex, slides.length - 1);
  const slide = slides[index];
  const accent = ACCENTS[index % ACCENTS.length];

  const project = slide.kind === "quote" ? slide.project : slide.project;
  const quote = slide.kind === "quote" ? slide.quote : undefined;

  const heading =
    project?.title ||
    quote?.company ||
    quote?.author ||
    "Unique Web Layer";

  const subheading = project
    ? project.category
    : [quote?.role, quote?.company].filter(Boolean).join(", ");

  const accentColour = project?.color || "#a78bfa";
  const hasLink = Boolean(project?.liveLink && project.liveLink !== "#");
  const key = quote ? `q${quote.id}` : `p${project?.id}`;

  const go = (dir: 1 | -1) =>
    setActiveIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-black" />
      <Stars />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-600/10 px-4 py-1.5 backdrop-blur-sm">
            <HiOutlineSparkles className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              Client Work
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="bg-linear-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Built, shipped, live.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-4 text-sm text-gray-400 sm:text-base">
            Real projects for real businesses — every one of them is online
            right now, and you can open it yourself.
          </p>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="uwl-panel relative overflow-hidden rounded-2xl border p-5 sm:rounded-3xl sm:p-8 md:p-10"
          >
            <div className="flex flex-col items-center gap-6 md:grid md:grid-cols-[auto_1fr] md:items-start md:gap-10">
              {/* Screenshot, or the person's initials when there is no project */}
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-2xl bg-linear-to-br ${accent} opacity-60 blur-xl`}
                />
                <div
                  className={`relative h-28 w-28 overflow-hidden rounded-2xl bg-linear-to-br ${accent} p-2 ring-1 ring-white/20 sm:h-32 sm:w-32`}
                >
                  {project?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={`${project.title} — ${project.category}`}
                      className="h-full w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-black/40 text-2xl font-bold text-white/80">
                      {initials(project?.title || quote?.author || "")}
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center md:text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {project ? lineLabel(project.type) : "Client"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="w-full text-center md:text-left">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {heading}
                </h3>
                {subheading && (
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: accentColour }}
                  >
                    {subheading}
                  </p>
                )}

                {quote ? (
                  <>
                    {quote.rating ? (
                      <p
                        className="mt-3 text-sm tracking-[0.2em] text-amber-300"
                        aria-label={`${quote.rating} out of 5`}
                      >
                        {"★".repeat(quote.rating)}
                      </p>
                    ) : null}

                    <blockquote className="mt-4 text-base leading-relaxed text-gray-200 md:text-lg">
                      “{quote.quote}”
                    </blockquote>

                    <p className="mt-3 text-sm text-gray-400">
                      <span className="font-semibold text-white">
                        {quote.author}
                      </span>
                      {[quote.role, quote.company].filter(Boolean).length > 0 &&
                        ` — ${[quote.role, quote.company].filter(Boolean).join(", ")}`}
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-gray-300 md:text-base">
                    {project?.description}
                  </p>
                )}

                {project && project.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {project && (
                  <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-purple-500/40 px-5 py-2.5 text-sm font-medium text-purple-200 transition hover:bg-purple-600/10"
                    >
                      View case study
                    </Link>

                    {hasLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                      >
                        <FiExternalLink className="h-4 w-4" />
                        Open the live site
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Arrows */}
            {slides.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3 border-t border-white/10 pt-6 md:justify-end">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300 transition hover:border-purple-500/60 hover:text-white"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white transition hover:brightness-110"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Selector strip */}
        {slides.length > 1 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {slides.map((s, i) => {
              const isActive = i === index;
              const label =
                s.kind === "quote"
                  ? s.project?.title || s.quote.company || s.quote.author
                  : s.project.title;
              return (
                <button
                  key={s.kind === "quote" ? `q${s.quote.id}` : `p${s.project.id}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show ${label}`}
                  aria-current={isActive}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                    isActive
                      ? "border-transparent bg-linear-to-r from-purple-600 to-pink-600 text-white"
                      : "border-white/10 bg-white/4 text-gray-400 hover:border-purple-500/40 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer link */}
        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="text-sm text-purple-300 transition-colors hover:text-purple-200"
          >
            See the full portfolio →
          </Link>
        </div>
      </div>
    </section>
  );
}
