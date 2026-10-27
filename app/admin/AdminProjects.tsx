"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAdminSession } from "./AdminShell";
import AddProjectModal from "../portfolio/AddProjectModal";
import {
  fetchProjects,
  deleteProject as deleteProjectRequest,
  ApiRequestError,
  type ApiProject,
} from "../lib/api";
import { SERVICE_TYPE_LABELS } from "../lib/serviceTypes";

/**
 * Project management lives here rather than on the public portfolio page.
 *
 * On /portfolio the controls sat on top of the cards a visitor sees, so every
 * edit happened inside the thing being edited and a mis-click was a delete on
 * a live page. Here the list is a plain table — drafts and published side by
 * side, which the public page could never show.
 */

function formatDate(value: string) {
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminProjects() {
  const { token } = useAdminSession();
  const params = useSearchParams();

  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiProject | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProjects(await fetchProjects());
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Could not load projects.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // The dashboard's "Add a project" shortcut links here with ?new=1.
  useEffect(() => {
    if (params.get("new") === "1") {
      setEditing(null);
      setShowForm(true);
    }
  }, [params]);

  const lineLabel = (slug: ApiProject["type"]) =>
    SERVICE_TYPE_LABELS[slug] || slug;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.client || "").toLowerCase().includes(term),
    );
  }, [projects, search]);

  const remove = async (project: ApiProject) => {
    const confirmed = window.confirm(
      `Delete "${project.title}"?\n\n` +
        `This removes it from the database and from the live site. ` +
        `The page at /portfolio/${project.slug} will stop working, so any link ` +
        `to it — including one Google has indexed — will 404.\n\n` +
        `To take it off the site without losing the page, edit it and untick ` +
        `Published instead.`,
    );
    if (!confirmed) return;

    setDeletingId(project.id);
    setError("");
    try {
      await deleteProjectRequest(project.id, token);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setNotice(`"${project.title}" deleted.`);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not delete that project.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const onSaved = (project: ApiProject, mode: "created" | "updated") => {
    setProjects((prev) =>
      mode === "created"
        ? [project, ...prev]
        : prev.map((p) => (p.id === project.id ? project : p)),
    );
    setShowForm(false);
    setEditing(null);
    setNotice(
      mode === "created"
        ? `"${project.title}" added.`
        : `"${project.title}" updated.`,
    );
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Projects
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {projects.length} project{projects.length === 1 ? "" : "s"} ·{" "}
            {projects.filter((p) => !p.isPublished).length} draft
            {projects.filter((p) => !p.isPublished).length === 1 ? "" : "s"}
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
        >
          + Add Project
        </button>
      </div>

      {notice && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {projects.length > 6 && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category or client"
          className="mb-6 w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
        />
      )}

      {loading ? (
        <p className="py-20 text-center text-gray-500">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-500/25 py-20 text-center">
          <p className="text-gray-400">
            {search ? "Nothing matches that." : "No projects yet."}
          </p>
          {!search && (
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="mt-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Add the first one
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((project) => (
            <li
              key={project.id}
              className="uwl-panel flex flex-wrap items-center gap-4 rounded-2xl border p-4"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-gray-600">
                    no image
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white">{project.title}</span>
                  {!project.isPublished && (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
                      Draft
                    </span>
                  )}
                  {project.featured && (
                    <span className="rounded-full border border-purple-500/40 bg-purple-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-purple-200">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {lineLabel(project.type)} · {project.category}
                  {project.client ? ` · ${project.client}` : ""} · updated{" "}
                  {formatDate(project.updatedAt)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/5"
                >
                  View
                </Link>
                <button
                  onClick={() => {
                    setEditing(project);
                    setShowForm(true);
                  }}
                  className="rounded-full border border-purple-400/40 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-600/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => void remove(project)}
                  disabled={deletingId === project.id}
                  className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  {deletingId === project.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <AddProjectModal
          token={token}
          project={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
