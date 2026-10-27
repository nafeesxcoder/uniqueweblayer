"use client";

import { useState, useRef, useEffect } from "react";
import { Stars } from "./Stars";
import Link from "next/link";
import { fetchProjects, type ApiProject } from "../lib/api";
import Icon from "./Icon";

export default function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<ApiProject[]>([]);
  const sectionRef = useRef(null);

  // Featured projects come from the database, so ticking "show on the home
  // page" in the Add Project form is enough — no code change needed.
  useEffect(() => {
    let cancelled = false;
    fetchProjects({ featured: true })
      .then((list) => {
        if (!cancelled) setFeaturedProjects(list);
      })
      .catch(() => {
        /* the section simply stays empty if the API is unreachable */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <Stars />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
            <Icon name="fa-briefcase" className="text-purple-400 text-sm" />
            <span className="text-sm font-medium text-purple-300">
              Selected Projects
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Work We&apos;ve Shipped
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            A few recent builds for clients in logistics, media, real estate and
            professional services.
          </p>
        </div>

        {/* Grid — hidden until the featured projects have loaded */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-7 ${
            featuredProjects.length === 0 ? "hidden" : ""
          }`}
        >
          {featuredProjects.map((project, index) => (
            <article
              key={project.id}
              className={`group transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${Math.min(index * 90, 400)}ms` }}
            >
              <div className="relative h-full bg-linear-to-br from-purple-900/40 to-purple-950/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
                <div className="relative h-56 overflow-hidden bg-linear-to-br from-purple-900/60 to-black">
                  <div className="absolute inset-0 bg-linear-to-t from-purple-950/80 via-transparent to-transparent z-10" />
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={`${project.title} — built by Unique Web Layer`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="fa-code" className="text-5xl text-purple-400/40" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: project.color }}
                  >
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:brightness-125"
                    style={{ color: project.color }}
                  >
                    View live project
                    <Icon name="fa-arrow-right" className="text-xs group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/portfolio">
            <button className="px-8 py-3 rounded-full border border-purple-400/50 text-white text-sm font-semibold hover:bg-purple-600/10 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              See the full portfolio
              <Icon name="fa-arrow-right" className="text-xs" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
