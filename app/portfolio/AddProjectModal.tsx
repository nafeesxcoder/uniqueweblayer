"use client";

import { useEffect, useRef, useState } from "react";
import {
  ApiRequestError,
  createProject,
  updateProject,
  type ApiProject,
} from "../lib/api";
import { serviceLines } from "../data/services";
import Icon from "../components/Icon";
import ModalPortal from "../components/ModalPortal";

const COLOUR_PRESETS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#3b82f6",
  "#facc15",
];

type Field =
  | "title"
  | "category"
  | "type"
  | "description"
  | "liveLink"
  | "tags"
  | "client"
  | "country"
  | "result"
  | "color"
  | "sortOrder";

const EMPTY = {
  title: "",
  category: "",
  type: "web-development",
  description: "",
  liveLink: "",
  tags: "",
  client: "",
  country: "",
  result: "",
  color: "#8b5cf6",
  sortOrder: "0",
  featured: false,
  isPublished: true,
};

/**
 * The "no code change needed" project form, used for both adding and editing.
 *
 * Pass `project` to edit an existing row. Editing sends a PATCH with only the
 * fields on the form, so leaving the screenshot alone keeps the current one
 * rather than wiping it.
 *
 * Editing instead of delete-and-re-add also matters for SEO: deleting loses
 * the slug, which breaks the /portfolio/<slug> URL Google has indexed.
 */
export default function AddProjectModal({
  token,
  project,
  onClose,
  onSaved,
}: {
  token: string;
  /** Omit to create a new project. */
  project?: ApiProject | null;
  onClose: () => void;
  onSaved: (project: ApiProject, mode: "created" | "updated") => void;
}) {
  const isEdit = Boolean(project);

  const [form, setForm] = useState(() =>
    project
      ? {
          title: project.title,
          category: project.category,
          type: project.type,
          description: project.description,
          liveLink: project.liveLink || "",
          tags: project.tags.join(", "),
          client: project.client || "",
          country: project.country || "",
          result: project.result || "",
          color: project.color,
          sortOrder: String(project.sortOrder ?? 0),
          featured: project.featured,
          isPublished: project.isPublished,
        }
      : EMPTY,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(project?.image || "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  /**
   * Hold the page still while the form is open.
   *
   * Without this, scrolling inside the form carries on into the page behind it
   * once the form hits its end, so you look away for a second and the whole
   * site has moved. The width the scrollbar was taking is given back as
   * padding, otherwise the page jumps sideways the moment it is hidden.
   */
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  const set = (
    field: Field | "featured" | "isPublished",
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setFieldErrors({});

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("category", form.category);
      data.append("type", form.type);
      data.append("description", form.description);
      data.append("color", form.color);
      data.append("tags", form.tags);
      if (form.liveLink) data.append("liveLink", form.liveLink);
      if (form.client) data.append("client", form.client);
      if (form.country) data.append("country", form.country);
      if (form.result) data.append("result", form.result);
      data.append("sortOrder", form.sortOrder || "0");
      // Booleans are always sent, so unticking them actually saves.
      data.append("featured", form.featured ? "true" : "false");
      data.append("isPublished", form.isPublished ? "true" : "false");
      if (imageFile) data.append("image", imageFile);

      // On edit, omitted optional fields clear; empty strings are sent above
      // only when non-empty, so append blanks explicitly when editing.
      if (isEdit) {
        if (!form.liveLink) data.append("liveLink", "");
        if (!form.client) data.append("client", "");
        if (!form.country) data.append("country", "");
        if (!form.result) data.append("result", "");
      }

      const saved = isEdit
        ? await updateProject(project!.id, data, token)
        : await createProject(data, token);

      onSaved(saved, isEdit ? "updated" : "created");
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setError("Could not save the project — try again");
      }
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none";

  const Err = ({ name }: { name: string }) =>
    fieldErrors[name] ? (
      <p className="mt-1 text-xs text-red-400">{fieldErrors[name]}</p>
    ) : null;

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto overscroll-contain uwl-scrim p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit project" : "Add a project"}
    >
      <div
        className="uwl-modal w-full max-w-2xl rounded-2xl border p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEdit ? "Edit project" : "Add a project"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isEdit
                ? "Changes save straight to the database. Leave the screenshot alone to keep the current one."
                : "Saved straight to the database — no code change, no redeploy."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <Icon name="fa-xmark" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Project title *
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Hotel Daawat"
                required
                className={inputClass}
              />
              <Err name="title" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Category *
              </label>
              <input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Restaurant Website"
                required
                className={inputClass}
              />
              <Err name="category" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Service line *
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="uwl-select w-full rounded-xl border border-white/10 px-4 py-3 focus:border-purple-500 focus:outline-none"
            >
              {serviceLines.map((line) => (
                <option key={line.slug} value={line.slug}>
                  {line.category}
                </option>
              ))}
            </select>
            <Err name="type" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="What you built, who it was for and the main features."
              required
              className={`${inputClass} resize-y`}
            />
            <Err name="description" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Live link
              </label>
              <input
                value={form.liveLink}
                onChange={(e) => set("liveLink", e.target.value)}
                placeholder="https://example.com"
                className={inputClass}
              />
              <Err name="liveLink" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Tech tags
              </label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="Next.js, Tailwind CSS, MySQL"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">Separate with commas</p>
              <Err name="tags" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Client name
              </label>
              <input
                value={form.client}
                onChange={(e) => set("client", e.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Result
              </label>
              <input
                value={form.result}
                onChange={(e) => set("result", e.target.value)}
                placeholder="e.g. 3x more enquiries in 2 months"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Country{" "}
              <span className="font-normal text-gray-500">
                — stored for SEO and reporting only, never shown on the card
              </span>
            </label>
            <input
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          {/* Screenshot */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Screenshot
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="rounded-xl border border-dashed border-purple-500/40 px-5 py-3 text-sm text-purple-200 transition hover:bg-purple-500/10"
              >
                <Icon name="fa-image" className="mr-2" />
                {imageFile || preview ? "Change image" : "Choose image"}
              </button>
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Selected screenshot preview"
                  className="h-16 w-24 rounded-lg border border-white/10 object-cover"
                />
              )}
              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPreview("");
                    if (fileInput.current) fileInput.current.value = "";
                  }}
                  className="text-xs text-gray-400 underline hover:text-white"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
              onChange={pickImage}
              className="hidden"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              PNG, JPG, WEBP or SVG — 5 MB maximum
            </p>
            <Err name="image" />
          </div>

          {/* Accent colour */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Accent colour
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOUR_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => set("color", hex)}
                  aria-label={`Use accent colour ${hex}`}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    form.color === hex
                      ? "scale-110 border-white"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <input
                type="color"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
                aria-label="Pick a custom accent colour"
              />
            </div>
            <Err name="color" />
          </div>

          <div>
            <label htmlFor="sortOrder" className="mb-1.5 block text-xs font-medium text-gray-400">
              Display order{" "}
              <span className="font-normal text-gray-500">
                — lower numbers appear first
              </span>
            </label>
            <input
              id="sortOrder"
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
              className={inputClass}
            />
            <Err name="sortOrder" />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-purple-500"
            />
            <span className="text-sm text-gray-300">
              Also show this project on the home page
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
              className="h-4 w-4 accent-purple-500"
            />
            <span className="text-sm text-gray-300">
              Visible on the site
              <span className="block text-xs text-gray-500">
                Untick to hide it without deleting — the URL keeps working for you
              </span>
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? "Saving…" : isEdit ? "Save changes" : "Add project"}
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
