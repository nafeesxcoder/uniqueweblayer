"use client";

import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import ModalPortal from "../components/ModalPortal";
import {
  fetchDocumentBlob,
  ApiRequestError,
  type ApiDocument,
} from "../lib/api";
import {
  documentKind,
  DocxViewer,
  PdfViewer,
  PptxViewer,
  RtfViewer,
  XlsxViewer,
  ZipViewer,
} from "./DocumentViewers";

/**
 * Opens any stored document inside the admin area, on desktop and on phones,
 * without saving it to the device. Downloading stays a separate, explicit tap.
 */
export default function DocumentPreview({
  doc,
  token,
  onDownload,
  onClose,
}: {
  doc: ApiDocument;
  token: string;
  onDownload: () => void;
  onClose: () => void;
}) {
  const kind = documentKind(doc);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    setLoading(true);
    setError("");
    setBlob(null);
    setText("");
    setImageUrl("");

    fetchDocumentBlob(doc, token)
      .then(async (file) => {
        if (cancelled) return;
        if (kind === "text") {
          const content = await file.text();
          if (!cancelled) setText(content);
        } else if (kind === "image") {
          objectUrl = URL.createObjectURL(
            new Blob([file], { type: doc.mime_type || "image/png" }),
          );
          setImageUrl(objectUrl);
        } else {
          setBlob(file);
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
  }, [doc, token, kind]);

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
        className="fixed inset-0 z-100 flex items-center justify-center uwl-scrim p-2 backdrop-blur-sm sm:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of ${doc.title}`}
      >
        <div
          className="uwl-modal flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white">
                {doc.title}
              </h2>
              <p className="truncate text-xs text-gray-500">{doc.original_name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={onDownload}
                aria-label="Download"
                title="Download"
                className="rounded-lg p-2 text-gray-400 transition hover:text-white"
              >
                <FiDownload />
              </button>
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

          <div className="min-h-0 flex-1 overflow-auto bg-white/4">
            {loading && (
              <p className="py-20 text-center text-sm text-gray-500">Opening…</p>
            )}

            {error && (
              <p className="m-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            {!loading && !error && (
              <>
                {kind === "image" && imageUrl && (
                  <div className="flex min-h-full items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={doc.title}
                      className="max-h-[78vh] max-w-full rounded-lg object-contain"
                    />
                  </div>
                )}

                {kind === "text" && (
                  <pre className="whitespace-pre-wrap wrap-break-word p-5 font-mono text-xs leading-relaxed text-gray-300">
                    {text}
                  </pre>
                )}

                {blob && kind === "pdf" && <PdfViewer blob={blob} />}
                {blob && kind === "docx" && <DocxViewer blob={blob} />}
                {blob && kind === "xlsx" && <XlsxViewer blob={blob} />}
                {blob && kind === "pptx" && <PptxViewer blob={blob} />}
                {blob && kind === "zip" && <ZipViewer blob={blob} />}
                {blob && kind === "rtf" && <RtfViewer blob={blob} />}

                {kind === "legacy" && (
                  <div className="mx-auto max-w-md px-6 py-20 text-center">
                    <p className="font-semibold text-white">
                      This older Office format cannot be shown in the browser
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      Save it as .docx, .xlsx or .pptx and upload it again to view
                      it here.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
