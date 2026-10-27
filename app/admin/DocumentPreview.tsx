"use client";

import { useEffect, useState } from "react";
import ModalPortal from "../components/ModalPortal";
import {
  fetchDocumentBlob,
  ApiRequestError,
  type ApiDocument,
} from "../lib/api";

/**
 * Opens a document without leaving the admin area.
 *
 * IMPORTANT — mobile PDF:
 * iOS Safari and most mobile browsers do NOT render a PDF inside <iframe>.
 * On desktop the iframe works; on mobile we show a big "Open PDF" button
 * that opens the blob in a new tab, which fires the OS's native PDF viewer
 * (Preview on iOS, Drive/Chrome PDF viewer on Android).
 */

export function canPreview(doc: ApiDocument): boolean {
  const mime = doc.mime_type || "";
  return (
    mime === "application/pdf" ||
    mime === "text/plain" ||
    mime === "text/csv" ||
    mime.startsWith("image/")
  );
}

export default function DocumentPreview({
  doc,
  token,
  onClose,
}: {
  doc: ApiDocument;
  token: string;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  /** Detected once on mount — not on every render. */
  const [isMobile, setIsMobile] = useState(false);

  const isText = doc.mime_type === "text/plain" || doc.mime_type === "text/csv";
  const isImage = doc.mime_type.startsWith("image/");
  const isPdf = doc.mime_type === "application/pdf";

  // Detect mobile once. `pointer: coarse` is the reliable signal (a resized
  // desktop window is not "mobile", a small phone is).
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    // Reset state each time the doc changes (rare, but correct).
    setLoading(true);
    setError("");
    setText("");
    setUrl("");

    fetchDocumentBlob(doc, token)
      .then(async (blob) => {
        if (cancelled) return;

        if (isText) {
          setText(await blob.text());
        } else {
          /*
           * Force the correct MIME. Some backends send application/octet-stream,
           * which makes mobile browsers download the file instead of displaying
           * it — even when the URL ends in .pdf.
           */
          const typed = new Blob([blob], {
            type: isPdf
              ? "application/pdf"
              : isImage
                ? blob.type || "image/png"
                : blob.type,
          });
          objectUrl = URL.createObjectURL(typed);
          setUrl(objectUrl);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiRequestError
            ? err.message
            : "Could not open that file.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc, token, isText, isPdf, isImage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-100 flex items-center justify-center uwl-scrim p-4 backdrop-blur-sm sm:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of ${doc.title}`}
      >
        <div
          className="uwl-modal flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white">
                {doc.title}
              </h2>
              <p className="truncate text-xs text-gray-500">
                {doc.original_name}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {/* Explicit open button — the fix for mobile PDF */}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-purple-400/40 px-3 py-1.5 text-xs font-medium text-purple-200 transition hover:bg-purple-600/10"
                >
                  Open in new tab
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="rounded-lg px-2 py-1 text-gray-400 transition hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-white/4">
            {loading && (
              <p className="py-20 text-center text-sm text-gray-500">
                Opening…
              </p>
            )}

            {error && (
              <p className="m-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            {/* ---------- PDF ---------- */}
            {!loading && !error && isPdf && url && (
              <>
                {/*
                 * Mobile: iframes DO NOT render PDFs on iOS Safari or most
                 * Android browsers. Show a big button that opens the blob in
                 * a new tab — the OS's native viewer handles the rendering.
                 */}
                {isMobile ? (
                  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10">
                      <span className="text-lg font-bold text-red-300">
                        PDF
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Tap to open the PDF
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Mobile browsers do not show PDFs inside the app — it
                        will open in your phone's PDF viewer.
                      </p>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      Open PDF
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={url}
                    title={doc.title}
                    className="h-full min-h-[70vh] w-full border-0 bg-white"
                  />
                )}
              </>
            )}

            {/* ---------- Image ---------- */}
            {!loading && !error && isImage && url && (
              <div className="flex min-h-[50vh] items-center justify-center p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={doc.title}
                  className="max-h-[75vh] max-w-full rounded-lg object-contain"
                />
              </div>
            )}

            {/* ---------- Text ---------- */}
            {!loading && !error && isText && (
              <pre className="whitespace-pre-wrap wrap-break-word p-5 font-mono text-xs leading-relaxed text-gray-300">
                {text}
              </pre>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
