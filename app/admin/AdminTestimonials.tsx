"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "./AdminShell";
import TestimonialModal from "./TestimonialModal";
import {
  fetchTestimonials,
  deleteTestimonial as deleteRequest,
  fetchProjects,
  ApiRequestError,
  type ApiTestimonial,
  type ApiProject,
} from "../lib/api";

function formatDate(value: string) {
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminTestimonials() {
  const { token } = useAdminSession();

  const [items, setItems] = useState<ApiTestimonial[]>([]);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiTestimonial | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Drafts included — the admin list is the only place they are visible.
      const [list, projectList] = await Promise.all([
        fetchTestimonials(token, true),
        fetchProjects(),
      ]);
      setItems(list);
      setProjects(projectList);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not load testimonials.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (t: ApiTestimonial) => {
    const confirmed = window.confirm(
      `Delete the quote from ${t.author}?\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(t.id);
    setError("");
    try {
      await deleteRequest(t.id, token);
      setItems((prev) => prev.filter((x) => x.id !== t.id));
      setNotice(`Quote from ${t.author} deleted.`);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not delete that testimonial.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const onSaved = (t: ApiTestimonial, mode: "created" | "updated") => {
    setItems((prev) =>
      mode === "created"
        ? [...prev, t].sort((a, b) => a.sort_order - b.sort_order)
        : prev.map((x) => (x.id === t.id ? t : x)),
    );
    setShowForm(false);
    setEditing(null);
    setNotice(
      mode === "created"
        ? `Quote from ${t.author} added.`
        : `Quote from ${t.author} updated.`,
    );
  };

  const published = items.filter((t) => t.is_published === 1).length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Testimonials
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {items.length} saved · {published} showing on the site
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
        >
          + Add testimonial
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

      {loading ? (
        <p className="py-20 text-center text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-500/25 px-6 py-16 text-center">
          <p className="text-gray-400">No testimonials yet.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Until there is one here, the Client Work section on the home page
            describes each project in your own words — which is honest, and
            still convincing. One real line from a client beats ten invented
            ones.
          </p>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="mt-5 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Add the first one
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li key={t.id} className="uwl-panel rounded-2xl border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{t.author}</span>
                    {(t.role || t.company) && (
                      <span className="text-xs text-gray-500">
                        {[t.role, t.company].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {t.rating && (
                      <span className="text-xs text-amber-300">
                        {"★".repeat(t.rating)}
                      </span>
                    )}
                    {t.is_published === 0 && (
                      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
                        Hidden
                      </span>
                    )}
                  </div>

                  <blockquote className="text-sm leading-relaxed text-gray-300">
                    “{t.quote}”
                  </blockquote>

                  <p className="mt-2 text-xs text-gray-500">
                    {t.project_title
                      ? `Linked to ${t.project_title}`
                      : "Not linked to a project"}
                    {" · order "}
                    {t.sort_order}
                    {" · added "}
                    {formatDate(t.created_at)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => {
                      setEditing(t);
                      setShowForm(true);
                    }}
                    className="rounded-full border border-purple-400/40 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-600/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void remove(t)}
                    disabled={deletingId === t.id}
                    className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {deletingId === t.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <TestimonialModal
          token={token}
          testimonial={editing}
          projects={projects}
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
