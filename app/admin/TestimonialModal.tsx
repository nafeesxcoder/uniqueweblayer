"use client";

import { useEffect, useState } from "react";
import ModalPortal from "../components/ModalPortal";
import {
  createTestimonial,
  updateTestimonial,
  uploadTestimonialLogo,
  ApiRequestError,
  type ApiTestimonial,
  type ApiProject,
} from "../lib/api";

/**
 * The form for one client quote.
 *
 * The logo is uploaded here and belongs to the testimonial. Linking a project
 * is optional and only adds a "visit website" link to the public card.
 */
export default function TestimonialModal({
  token,
  testimonial,
  projects,
  onClose,
  onSaved,
}: {
  token: string;
  /** Omit to write a new one. */
  testimonial?: ApiTestimonial | null;
  projects: ApiProject[];
  onClose: () => void;
  onSaved: (t: ApiTestimonial, mode: "created" | "updated") => void;
}) {
  const isEdit = Boolean(testimonial);

  const [author, setAuthor] = useState(testimonial?.author || "");
  const [role, setRole] = useState(testimonial?.role || "");
  const [company, setCompany] = useState(testimonial?.company || "");
  const [logo, setLogo] = useState(testimonial?.logo || "");
  const [logoBusy, setLogoBusy] = useState(false);
  const [quote, setQuote] = useState(testimonial?.quote || "");
  const [rating, setRating] = useState<string>(
    testimonial?.rating ? String(testimonial.rating) : "",
  );
  const [projectId, setProjectId] = useState<string>(
    testimonial?.project_id ? String(testimonial.project_id) : "",
  );
  const [sortOrder, setSortOrder] = useState(
    String(testimonial?.sort_order ?? 0),
  );
  const [isPublished, setIsPublished] = useState(
    testimonial ? testimonial.is_published === 1 : true,
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  /* Hold the page still while the form is open — see AddProjectModal. */
  useEffect(() => {
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  const pickLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLogoBusy(true);
    setError("");
    try {
      setLogo(await uploadTestimonialLogo(file, token));
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not upload that logo.",
      );
    } finally {
      setLogoBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setFieldErrors({});

    const payload = {
      author: author.trim(),
      role: role.trim(),
      company: company.trim(),
      logo,
      quote: quote.trim(),
      rating: rating ? Number(rating) : null,
      projectId: projectId ? Number(projectId) : null,
      isPublished,
      sortOrder: Number(sortOrder) || 0,
    };

    try {
      const saved = testimonial
        ? await updateTestimonial(testimonial.id, payload, token)
        : await createTestimonial(payload, token);
      onSaved(saved, testimonial ? "updated" : "created");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setError("Could not save that — try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none";
  const label = "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto overscroll-contain uwl-scrim p-4 backdrop-blur-sm sm:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit testimonial" : "Add a testimonial"}
      >
        <div
          className="uwl-modal w-full max-w-2xl rounded-2xl border p-6 shadow-2xl sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? "Edit testimonial" : "Add a testimonial"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Only words a client actually wrote or signed off on. A quote
                anyone can check is worth more than a perfect one nobody said.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1 text-gray-500 transition hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="t-quote" className={label}>
                The quote *
              </label>
              <textarea
                id="t-quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                required
                placeholder="What they said, in their own words."
                className={`${field} resize-y`}
              />
              {fieldErrors.quote && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.quote}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="t-author" className={label}>
                  Name *
                </label>
                <input
                  id="t-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  placeholder="e.g. Jane Doe"
                  className={field}
                />
                {fieldErrors.author && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.author}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="t-role" className={label}>
                  Role
                </label>
                <input
                  id="t-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Operations Manager"
                  className={field}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="t-company" className={label}>
                  Company
                </label>
                <input
                  id="t-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Cal Coast Logistics"
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="t-rating" className={label}>
                  Rating
                </label>
                <select
                  id="t-rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className={`${field} uwl-select`}
                >
                  <option value="">No rating</option>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {"★".repeat(n)} ({n})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className={label}>Client logo</span>
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 p-1.5"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt="Client logo"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px]" style={{ color: "#6b6383" }}>
                      No logo
                    </span>
                  )}
                </div>
                <label className="cursor-pointer rounded-xl border border-purple-400/40 px-4 py-2 text-sm text-purple-200 transition hover:bg-purple-600/10">
                  {logoBusy ? "Uploading…" : logo ? "Change logo" : "Upload logo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                    onChange={(e) => void pickLogo(e)}
                    disabled={logoBusy}
                    className="sr-only"
                  />
                </label>
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo("")}
                    className="text-sm text-red-300 transition hover:text-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="t-project" className={label}>
                Project this is about
              </label>
              <select
                id="t-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={`${field} uwl-select`}
              >
                <option value="">Not linked to a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Optional. Adds a link to that project&apos;s live website.
              </p>
            </div>

            <div>
              <label htmlFor="t-order" className={label}>
                Display order — lower numbers appear first
              </label>
              <input
                id="t-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={field}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/4 p-4">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-purple-600"
              />
              <span className="text-sm text-gray-300">
                Show on the site
                <span className="mt-0.5 block text-xs text-gray-500">
                  Untick to keep it saved but hidden — useful while you wait for
                  the client to approve the wording.
                </span>
              </span>
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={busy || logoBusy}
                className="flex-1 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {busy
                  ? "Saving…"
                  : isEdit
                    ? "Save changes"
                    : "Add testimonial"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
