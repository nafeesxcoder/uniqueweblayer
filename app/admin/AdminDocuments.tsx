"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAdminSession } from "./AdminShell";
import DocumentPreview, { canPreview } from "./DocumentPreview";
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument as deleteRequest,
  downloadDocument,
  ApiRequestError,
  type ApiDocument,
} from "../lib/api";

/**
 * Your own files, kept with the site.
 *
 * Nothing here is public. The files sit outside the folder that serves project
 * screenshots, and every download goes through an endpoint that checks your
 * session — so a document cannot be reached by guessing a URL, even if someone
 * knows its name.
 */

const KINDS: Record<string, { label: string; tint: string }> = {
  pdf: { label: "PDF", tint: "border-red-500/40 bg-red-500/10 text-red-300" },
  doc: {
    label: "DOC",
    tint: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  },
  docx: {
    label: "DOC",
    tint: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  },
  xls: {
    label: "XLS",
    tint: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  xlsx: {
    label: "XLS",
    tint: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  csv: {
    label: "CSV",
    tint: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  ppt: {
    label: "PPT",
    tint: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  },
  pptx: {
    label: "PPT",
    tint: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  },
  zip: {
    label: "ZIP",
    tint: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
  txt: { label: "TXT", tint: "border-white/20 bg-white/5 text-gray-300" },
};

const IMAGE_KINDS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);

function kindOf(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (IMAGE_KINDS.has(ext)) {
    return {
      label: "IMG",
      tint: "border-purple-500/40 bg-purple-500/10 text-purple-200",
    };
  }
  return (
    KINDS[ext] || {
      label: ext.slice(0, 4).toUpperCase() || "FILE",
      tint: "border-white/20 bg-white/5 text-gray-300",
    }
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDocuments() {
  const { token } = useAdminSession();

  const [docs, setDocs] = useState<ApiDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState<ApiDocument | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setDocs(await fetchDocuments(token));
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not load your documents.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        d.original_name.toLowerCase().includes(term) ||
        (d.note || "").toLowerCase().includes(term),
    );
  }, [docs, search]);

  const totalBytes = docs.reduce((sum, d) => sum + Number(d.size_bytes), 0);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    const form = new FormData();
    form.append("file", file);
    if (title.trim()) form.append("title", title.trim());
    if (note.trim()) form.append("note", note.trim());

    try {
      const saved = await uploadDocument(form, token);
      setDocs((prev) => [saved, ...prev]);
      setNotice(`${saved.title} uploaded.`);
      setFile(null);
      setTitle("");
      setNote("");
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not upload that file.",
      );
    } finally {
      setUploading(false);
    }
  };

  const download = async (doc: ApiDocument) => {
    setBusyId(doc.id);
    setError("");
    try {
      await downloadDocument(doc, token);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not download that file.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (doc: ApiDocument) => {
    const confirmed = window.confirm(
      `Delete "${doc.title}"?\n\nThe file is removed from the server. This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusyId(doc.id);
    setError("");
    try {
      await deleteRequest(doc.id, token);
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
      setNotice(`${doc.title} deleted.`);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not delete that file.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Documents
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {docs.length} file{docs.length === 1 ? "" : "s"} ·{" "}
          {formatSize(totalBytes)}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-gray-500">
          Private to you. These files are not served to visitors and cannot be
          reached by guessing a URL — a download only works while you are signed
          in here.
        </p>
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

      {/* Upload */}
      <form
        onSubmit={upload}
        className="uwl-panel mb-8 rounded-2xl border p-5 sm:p-6"
      >
        <h2 className="mb-4 text-sm font-semibold text-white">Upload a file</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="doc-file"
              className="mb-1.5 block text-xs font-medium text-gray-400"
            >
              File *
            </label>
            <input
              id="doc-file"
              ref={fileInput}
              type="file"
              onChange={(e) => {
                const picked = e.target.files?.[0] || null;
                setFile(picked);
                // Saves typing: the filename is almost always the right title.
                if (picked && !title.trim()) {
                  setTitle(picked.name.replace(/\.[^.]+$/, ""));
                }
              }}
              className="w-full cursor-pointer rounded-xl border border-dashed border-purple-500/40 bg-white/4 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600/20 file:px-4 file:py-2 file:text-sm file:text-purple-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              PDF, Word, Excel, PowerPoint, ZIP, CSV, text or images — 25 MB
              maximum.
              {file && (
                <span className="text-gray-400">
                  {" "}
                  · {formatSize(file.size)} selected
                </span>
              )}
            </p>
          </div>

          <div>
            <label
              htmlFor="doc-title"
              className="mb-1.5 block text-xs font-medium text-gray-400"
            >
              Name it
            </label>
            <input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cal Coast contract 2026"
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="doc-note"
              className="mb-1.5 block text-xs font-medium text-gray-400"
            >
              Note
            </label>
            <input
              id="doc-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional — what it is, who it is for"
              className={field}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="mt-5 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>

      {docs.length > 6 && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or note"
          className="mb-6 w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
        />
      )}

      {/* List */}
      {loading ? (
        <p className="py-20 text-center text-gray-500">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-purple-500/25 py-16 text-center">
          <p className="text-gray-400">
            {search ? "Nothing matches that." : "No documents yet."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((doc) => {
            const kind = kindOf(doc.original_name);
            const busy = busyId === doc.id;

            return (
              <li
                key={doc.id}
                className="uwl-panel flex flex-wrap items-center gap-4 rounded-xl border p-4"
              >
                <span
                  className={`shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${kind.tint}`}
                >
                  {kind.label}
                </span>

                <div className="min-w-45 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {doc.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {doc.original_name} · {formatSize(Number(doc.size_bytes))} ·{" "}
                    {formatDate(doc.created_at)}
                    {doc.note && (
                      <span className="text-gray-400"> · {doc.note}</span>
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {canPreview(doc) && (
                    <button
                      onClick={() => setPreviewing(doc)}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/5"
                    >
                      View
                    </button>
                  )}
                  <button
                    onClick={() => void download(doc)}
                    disabled={busy}
                    className="rounded-full border border-purple-400/40 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-600/10 disabled:opacity-50"
                  >
                    {busy ? "Working…" : "Download"}
                  </button>
                  <button
                    onClick={() => void remove(doc)}
                    disabled={busy}
                    className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {previewing && (
        <DocumentPreview
          doc={previewing}
          token={token}
          onClose={() => setPreviewing(null)}
        />
      )}
    </div>
  );
}
