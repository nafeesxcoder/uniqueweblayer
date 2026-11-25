"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { Stars } from "./Stars";
import { fetchTestimonials, type ApiTestimonial } from "../lib/api";

/**
 * CLIENT TESTIMONIALS
 * ------------------------------------------------------------------
 * Only published rows from /admin/testimonials appear here, each with the logo
 * uploaded there. Projects have their own section and are no longer mixed in.
 * With nothing published the section is hidden rather than padded out.
 */

const initials = (value: string) =>
  value
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || "")
    .join("")
    .toUpperCase() || "UW";

export default function Testimonials() {
  const [items, setItems] = useState<ApiTestimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchTestimonials()
      .then((list) => {
        if (!cancelled) setItems(list);
      })
      .catch(() => {
        /* A failed read just leaves the section hidden. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % items.length),
      7000,
    );
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const index = Math.min(activeIndex, items.length - 1);
  const item = items[index];
  const business = item.company || item.author;
  const byline = [
    item.author !== business ? item.author : "",
    item.role,
    business,
  ]
    .filter(Boolean)
    .join(" · ");
  const liveLink =
    item.project_live_link && item.project_live_link !== "#"
      ? item.project_live_link
      : "";

  const go = (dir: 1 | -1) =>
    setActiveIndex((i) => (i + dir + items.length) % items.length);

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-black" />
      <Stars />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-600/10 px-4 py-1.5 backdrop-blur-sm">
            <HiOutlineSparkles className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              Testimonials
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="bg-linear-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              What our clients say
            </span>
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.figure
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="uwl-panel relative rounded-2xl border p-6 text-center sm:rounded-3xl sm:p-10"
          >
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl p-2 shadow-lg ring-1 ring-purple-500/30"
              style={{ backgroundColor: "#ffffff" }}
            >
              {item.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.logo}
                  alt={`${business} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="text-xl font-bold" style={{ color: "#6d28d9" }}>
                  {initials(business)}
                </span>
              )}
            </div>

            {item.rating ? (
              <p
                className="mt-5 text-sm tracking-[0.2em] text-amber-300"
                aria-label={`${item.rating} out of 5`}
              >
                {"★".repeat(item.rating)}
              </p>
            ) : null}

            <blockquote className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-200 md:text-xl">
              “{item.quote}”
            </blockquote>

            <figcaption className="mt-5">
              <span className="text-sm font-semibold text-white">{byline}</span>
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-1.5 text-xs text-purple-300 transition hover:text-purple-200"
                >
                  <FiExternalLink className="h-3.5 w-3.5" />
                  Visit website<span className="sr-only"> for {business}</span>
                </a>
              )}
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        {items.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300 transition hover:border-purple-500/60 hover:text-white"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs tabular-nums text-gray-500">
              {index + 1} / {items.length}
            </span>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-pink-700 text-white transition hover:brightness-110"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
