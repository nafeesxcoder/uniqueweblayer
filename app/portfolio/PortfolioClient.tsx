"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Stars } from "../components/Stars";
import AddProjectModal from "./AddProjectModal";
import { useAdminAuth } from "../lib/useAdminAuth";
import {
  fetchProjects,
  deleteProject as deleteProjectRequest,
  type ApiProject,
} from "../lib/api";
import { serviceLines } from "../data/services";
import Icon from "../components/Icon";

const ALL_FILTERS: { label: string; value: string }[] = [
  { label: "All Projects", value: "all" },
  ...serviceLines
    .filter((line) => line.slug && line.slug !== "all")
    .map((line) => ({ label: line.category, value: line.slug as string })),
];

export default function PortfolioClient({
  initialProjects,
}: {
  initialProjects: ApiProject[];
}) {
  const [projects, setProjects] = useState<ApiProject[]>(initialProjects);
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ApiProject | null>(null);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(initialProjects.length === 0);

  const { token, isAdmin, logout } = useAdminAuth();

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((rows) => {
        if (!cancelled) setProjects(rows);
      })
      .catch(() => {
        if (!cancelled && initialProjects.length === 0) {
          setLoadError(
            "Could not load projects. Check that the backend is running.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: projects.length };
    for (const line of serviceLines) {
      if (!line.slug || line.slug === "all") continue;
      result[line.slug] = 0;
    }
    for (const p of projects) {
      const type = p.type as string;
      if (type && type !== "all" && result[type] !== undefined) {
        result[type] += 1;
      }
    }
    return result;
  }, [projects]);

  const filters = useMemo(
    () =>
      ALL_FILTERS.filter(
        (f) => f.value === "all" || (counts[f.value] ?? 0) > 0,
      ),
    [counts],
  );

  const visibleProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => (p.type as string) === filter);
  }, [filter, projects]);

  useEffect(() => {
    if (filter === "all") return;
    if (!filters.some((f) => f.value === filter)) setFilter("all");
  }, [filters, filter]);

  const handleSaved = useCallback(
    (project: ApiProject, mode: "created" | "updated") => {
      setProjects((prev) =>
        mode === "created"
          ? [project, ...prev]
          : prev.map((p) => (p.id === project.id ? project : p)),
      );
    },
    [],
  );

  const handleDelete = useCallback(
    async (project: ApiProject) => {
      if (!token) return;
      const confirmed = window.confirm(
        `Delete "${project.title}"? This cannot be undone.`,
      );
      if (!confirmed) return;

      setDeletingId(project.id);
      try {
        await deleteProjectRequest(project.id, token);
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
      } catch {
        window.alert("Could not delete that project — try again.");
      } finally {
        setDeletingId(null);
      }
    },
    [token],
  );

  return (
    <main className="min-h-screen bg-black">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <Stars />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header — no animation gate */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
              <Icon name="fa-folder-open" className="text-purple-400 text-sm" />
              <span className="text-sm font-medium text-purple-300">
                Portfolio
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Our Portfolio
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Websites, mobile apps, software platforms, design systems,
              marketing campaigns and AI builds delivered for our clients.
            </p>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:scale-105"
              >
                <Icon name="fa-sliders" className="text-xs" />
                Manage projects
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Sign out
              </button>
            </div>
          )}

          {loadError && (
            <p className="mx-auto mb-8 max-w-xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-200">
              {loadError}
            </p>
          )}

          {/* Filter bar — horizontal scroll on mobile */}
          <div
            className="mb-12 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filter portfolio by service"
          >
            {filters.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.value)}
                  className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                    active
                      ? "bg-linear-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/25"
                      : "bg-white/3 text-gray-300 border-white/10 hover:border-purple-500/50 hover:text-white"
                  }`}
                >
                  {f.label}
                  <span
                    className={`ml-2 text-[11px] ${
                      active ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {counts[f.value] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid — no fade-in gate, always visible */}
          {refreshing && projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl border border-white/5 bg-white/5"
                />
              ))}
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-purple-500/25 bg-white/2 py-20 text-center">
              <Icon
                name="fa-folder-open"
                className="mb-4 text-4xl text-purple-400/40"
              />
              <p className="text-gray-400">
                {filter === "all"
                  ? "No projects published yet — check back soon."
                  : "No projects in this category yet."}
              </p>
              {isAdmin && (
                <Link
                  href="/admin/projects?new=1"
                  className="mt-5 inline-block rounded-full border border-purple-400/50 px-6 py-2.5 text-sm font-medium text-purple-200 transition hover:bg-purple-600/10"
                >
                  Add the first one
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
              {visibleProjects.map((project) => {
                const hasLink = Boolean(
                  project.liveLink && project.liveLink !== "#",
                );
                const lineLabel =
                  serviceLines.find((l) => l.slug === project.type)?.category ||
                  "Project";

                return (
                  <article key={project.id} className="group">
                    <div className="relative bg-linear-to-br from-purple-900/40 to-purple-950/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] h-full flex flex-col">
                      <div className="relative h-52 overflow-hidden bg-linear-to-br from-purple-900/60 to-black">
                        <div className="absolute inset-0 bg-linear-to-t from-purple-950/80 via-transparent to-transparent z-10" />
                        {project.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image}
                            alt={`${project.title} — ${project.category} project by Unique Web Layer`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 border-b border-dashed border-purple-500/30">
                            <Icon
                              name="fa-image"
                              className="text-4xl text-purple-400/40"
                            />
                            <span className="text-[11px] text-purple-300/50 font-mono">
                              no screenshot yet
                            </span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-black/60 backdrop-blur-sm border border-white/15 text-white">
                          {lineLabel}
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setEditing(project);
                              setShowAdd(true);
                            }}
                            aria-label={`Edit ${project.title}`}
                            className="absolute top-3 right-12 z-20 rounded-full border border-purple-400/40 bg-black/70 px-2.5 py-1 text-[11px] text-purple-200 backdrop-blur-sm transition hover:bg-purple-500/20"
                          >
                            <Icon name="fa-pen" className="text-[10px]" />
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(project)}
                            disabled={deletingId === project.id}
                            aria-label={`Delete ${project.title}`}
                            className="absolute top-3 right-3 z-20 rounded-full border border-red-400/40 bg-black/70 px-2.5 py-1 text-[11px] text-red-300 backdrop-blur-sm transition hover:bg-red-500/20 disabled:opacity-50"
                          >
                            <Icon name="fa-trash" className="text-[10px]" />
                          </button>
                        )}

                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                          style={{ backgroundColor: project.color }}
                        />
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <div
                          className="text-xs font-semibold mb-2"
                          style={{ color: project.color }}
                        >
                          {project.category}
                        </div>

                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                            <Link
                              href={`/portfolio/${project.slug}`}
                              className="hover:underline"
                            >
                              {project.title}
                            </Link>
                          </h2>
                          {hasLink && (
                            <div className="flex items-center gap-1.5 shrink-0 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[10px] text-green-500">
                                Live
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1">
                          {project.description}
                        </p>

                        {project.result && (
                          <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                            <Icon
                              name="fa-arrow-trend-up"
                              className="text-emerald-400 text-xs mt-0.5"
                            />
                            <span className="text-[11px] text-emerald-200/90">
                              {project.result}
                            </span>
                          </div>
                        )}

                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/portfolio/${project.slug}`}
                          className="mb-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/30 px-4 py-2.5 text-sm font-medium text-purple-200 transition-colors hover:bg-purple-600/10"
                        >
                          <Icon name="fa-file-lines" className="text-xs" />
                          <span>View case study</span>
                        </Link>

                        {hasLink ? (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 items-center justify-center gap-2 hover:brightness-125"
                            style={{
                              backgroundColor: `${project.color}20`,
                              color: project.color,
                            }}
                          >
                            <Icon
                              name="fa-external-link-alt"
                              className="text-xs"
                            />
                            <span>View Live Project</span>
                          </a>
                        ) : (
                          <span className="inline-flex w-full px-4 py-2.5 rounded-xl text-sm font-medium items-center justify-center gap-2 bg-white/4 border border-dashed border-white/15 text-gray-500">
                            <Icon name="fa-link-slash" className="text-xs" />
                            Link coming soon
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 backdrop-blur-sm p-8 sm:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Want a project like these?
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
              Tell us what you are building. You get a fixed quote, a timeline
              and a scope document — usually within one working day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
              <Link href="/contact">
                <button className="px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform w-full sm:w-auto">
                  Start a Project
                </button>
              </Link>
              <Link href="/services">
                <button className="px-7 py-3 rounded-full border border-purple-400/50 text-white text-sm font-semibold hover:bg-purple-600/10 transition-colors w-full sm:w-auto">
                  Browse Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {showAdd && token && (
        <AddProjectModal
          token={token}
          project={editing}
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}
