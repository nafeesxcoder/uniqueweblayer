"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FiFile, FiFolder, FiMinus, FiPlus } from "react-icons/fi";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { ApiDocument } from "../lib/api";

/**
 * In-app viewers for private documents.
 *
 * Everything is rendered in this browser from bytes the admin session already
 * fetched. Online Office viewers need a public file URL, which these documents
 * must never have. Each library loads only when its file type is opened.
 */

export type DocumentKind =
  | "pdf"
  | "image"
  | "text"
  | "rtf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "zip"
  | "legacy";

export function documentKind(doc: ApiDocument): DocumentKind {
  const ext = doc.original_name.split(".").pop()?.toLowerCase() || "";
  const mime = doc.mime_type || "";

  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (ext === "txt" || ext === "csv" || mime.startsWith("text/")) return "text";
  if (ext === "rtf") return "rtf";
  if (ext === "docx") return "docx";
  if (ext === "xlsx") return "xlsx";
  if (ext === "pptx") return "pptx";
  if (ext === "zip") return "zip";
  return "legacy";
}

function Status({ children }: { children: ReactNode }) {
  return <p className="py-20 text-center text-sm text-gray-500">{children}</p>;
}

function Failed() {
  return (
    <p className="m-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      This file could not be displayed. It may be damaged or password protected.
    </p>
  );
}

/** Runs an async parser for a blob and tracks loading and failure. */
function useParsed<T>(blob: Blob, parse: (blob: Blob) => Promise<T>) {
  const [state, setState] = useState<{ data?: T; failed?: boolean }>({});
  const parser = useRef(parse);

  useEffect(() => {
    let cancelled = false;
    setState({});
    parser
      .current(blob)
      .then((data) => {
        if (!cancelled) setState({ data });
      })
      .catch(() => {
        if (!cancelled) setState({ failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [blob]);

  return state;
}

/* ---------------------------------- PDF ---------------------------------- */

function PdfPage({
  pdf,
  number,
  width,
}: {
  pdf: PDFDocumentProxy;
  number: number;
  width: number;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [ratio, setRatio] = useState(1.414);

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !canvas.current || width <= 0) return;
    let cancelled = false;
    let task: { cancel: () => void; promise: Promise<void> } | undefined;

    void pdf.getPage(number).then((page) => {
      if (cancelled || !canvas.current) return;
      const base = page.getViewport({ scale: 1 });
      setRatio(base.height / base.width);

      const pixels = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: (width / base.width) * pixels });
      const target = canvas.current;
      target.width = Math.floor(viewport.width);
      target.height = Math.floor(viewport.height);
      const context = target.getContext("2d");
      if (!context) return;
      task = page.render({ canvasContext: context, viewport });
      task.promise.catch(() => {
        /* A cancelled render during zoom is expected. */
      });
    });

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, number, width, visible]);

  return (
    <div
      ref={holder}
      className="mx-auto overflow-hidden rounded shadow-lg"
      style={{ width, height: width * ratio, background: "#ffffff" }}
    >
      <canvas
        ref={canvas}
        aria-label={`Page ${number}`}
        style={{ display: "block", width, height: width * ratio }}
      />
    </div>
  );
}

export function PdfViewer({ blob }: { blob: Blob }) {
  const box = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  const [zoom, setZoom] = useState(1);
  const { data: pdf, failed } = useParsed(blob, async (file) => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    return pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  });

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const measure = () => setAvailable(node.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => void pdf?.destroy(), [pdf]);

  const width = Math.round(Math.min(Math.max(available - 24, 200), 900) * zoom);

  return (
    <div ref={box} className="relative min-h-full">
      {failed && <Failed />}
      {!pdf && !failed && <Status>Opening…</Status>}
      {pdf && (
        <>
          <div className="sticky top-2 z-10 flex justify-center">
            <div className="uwl-panel inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs text-gray-300 shadow-lg">
              <button type="button" aria-label="Zoom out" disabled={zoom <= 0.6} onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))} className="rounded-full p-1.5 disabled:opacity-40">
                <FiMinus />
              </button>
              <span className="w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
              <button type="button" aria-label="Zoom in" disabled={zoom >= 2.4} onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.2).toFixed(1)))} className="rounded-full p-1.5 disabled:opacity-40">
                <FiPlus />
              </button>
              <span className="border-l border-white/10 pl-2 pr-2">
                {pdf.numPages} {pdf.numPages === 1 ? "page" : "pages"}
              </span>
            </div>
          </div>
          <div className="space-y-3 overflow-x-auto p-3">
            {Array.from({ length: pdf.numPages }, (_, i) => (
              <PdfPage key={i + 1} pdf={pdf} number={i + 1} width={width} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* --------------------------------- Word ---------------------------------- */

export function DocxViewer({ blob }: { blob: Blob }) {
  const { data: html, failed } = useParsed(blob, async (file) => {
    const [{ default: mammoth }, { default: DOMPurify }] = await Promise.all([
      import("mammoth/mammoth.browser"),
      import("dompurify"),
    ]);
    const result = await mammoth.convertToHtml({
      arrayBuffer: await file.arrayBuffer(),
    });
    // Document content is untrusted, and the admin token is in this origin.
    return DOMPurify.sanitize(result.value, { USE_PROFILES: { html: true } });
  });

  if (failed) return <Failed />;
  if (html === undefined) return <Status>Opening…</Status>;
  return (
    <div className="p-3 sm:p-6">
      <article
        className="uwl-doc mx-auto max-w-3xl rounded p-5 shadow-lg sm:p-10"
        dangerouslySetInnerHTML={{ __html: html || "<p>This document is empty.</p>" }}
      />
    </div>
  );
}

/* --------------------------------- Excel --------------------------------- */

const MAX_ROWS = 2000;
const MAX_COLUMNS = 60;

interface Sheet {
  name: string;
  rows: string[][];
  clipped: boolean;
}

export function XlsxViewer({ blob }: { blob: Blob }) {
  const [active, setActive] = useState(0);
  const { data: sheets, failed } = useParsed(blob, async (file) => {
    const { default: ExcelJS } = await import("exceljs");
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(await file.arrayBuffer());

    return book.worksheets.map((sheet): Sheet => {
      const rows: string[][] = [];
      const columns = Math.min(sheet.actualColumnCount || sheet.columnCount, MAX_COLUMNS);
      sheet.eachRow({ includeEmpty: true }, (row, number) => {
        if (number > MAX_ROWS) return;
        rows.push(
          Array.from({ length: columns }, (_, i) => {
            try {
              return row.getCell(i + 1).text ?? "";
            } catch {
              return "";
            }
          }),
        );
      });
      return {
        name: sheet.name,
        rows,
        clipped: sheet.rowCount > MAX_ROWS || sheet.columnCount > MAX_COLUMNS,
      };
    });
  });

  if (failed) return <Failed />;
  if (!sheets) return <Status>Opening…</Status>;
  if (sheets.length === 0) return <Status>This workbook is empty.</Status>;

  const sheet = sheets[Math.min(active, sheets.length - 1)];

  return (
    <div className="p-3">
      {sheets.length > 1 && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                i === active
                  ? "border-purple-500 text-white"
                  : "border-white/15 text-gray-400"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-auto rounded-lg shadow-lg" style={{ background: "#ffffff" }}>
        <table className="uwl-sheet">
          <tbody>
            {sheet.rows.map((row, r) => (
              <tr key={r}>
                <th scope="row">{r + 1}</th>
                {row.map((cell, c) => (
                  <td key={c}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sheet.clipped && (
        <p className="mt-2 text-xs text-gray-500">
          Showing the first {MAX_ROWS} rows and {MAX_COLUMNS} columns.
        </p>
      )}
    </div>
  );
}

/* ------------------------------ PowerPoint ------------------------------- */

interface Slide {
  paragraphs: string[];
  images: string[];
}

const slideNumber = (name: string) =>
  Number(name.match(/slide(\d+)\.xml$/)?.[1] || 0);

export function PptxViewer({ blob }: { blob: Blob }) {
  const urls = useRef<string[]>([]);
  const { data: slides, failed } = useParsed(blob, async (file) => {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const names = Object.keys(zip.files)
      .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
      .sort((a, b) => slideNumber(a) - slideNumber(b));
    const parser = new DOMParser();
    const result: Slide[] = [];

    for (const name of names) {
      const xml = parser.parseFromString(await zip.files[name].async("text"), "application/xml");
      const paragraphs = Array.from(xml.getElementsByTagNameNS("*", "p"))
        .map((p) =>
          Array.from(p.getElementsByTagNameNS("*", "t"))
            .map((t) => t.textContent || "")
            .join(""),
        )
        .filter((t) => t.trim());

      const images: string[] = [];
      const relName = name.replace("slides/", "slides/_rels/") + ".rels";
      const rel = zip.files[relName];
      if (rel) {
        const rels = parser.parseFromString(await rel.async("text"), "application/xml");
        for (const item of Array.from(rels.getElementsByTagName("Relationship"))) {
          const target = item.getAttribute("Target") || "";
          if (!/image$/.test(item.getAttribute("Type") || "")) continue;
          if (!/\.(png|jpe?g|gif|webp)$/i.test(target)) continue;
          const media = zip.files[`ppt/${target.replace(/^(\.\.\/|\/ppt\/)+/, "")}`];
          if (!media) continue;
          const ext = target.split(".").pop()!.toLowerCase();
          const url = URL.createObjectURL(
            new Blob([await media.async("arraybuffer")], {
              type: `image/${ext === "jpg" ? "jpeg" : ext}`,
            }),
          );
          urls.current.push(url);
          images.push(url);
        }
      }
      result.push({ paragraphs, images });
    }
    return result;
  });

  useEffect(
    () => () => {
      urls.current.forEach((u) => URL.revokeObjectURL(u));
      urls.current = [];
    },
    [],
  );

  if (failed) return <Failed />;
  if (!slides) return <Status>Opening…</Status>;
  if (slides.length === 0) return <Status>This presentation has no slides.</Status>;

  return (
    <div className="space-y-4 p-3 sm:p-6">
      {slides.map((slide, i) => (
        <section key={i} className="uwl-doc mx-auto max-w-3xl rounded p-5 shadow-lg sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7c3aed" }}>
            Slide {i + 1}
          </p>
          {slide.paragraphs.map((text, n) =>
            n === 0 ? <h2 key={n}>{text}</h2> : <p key={n}>{text}</p>,
          )}
          {slide.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt={`Slide ${i + 1}`} />
          ))}
        </section>
      ))}
    </div>
  );
}

/* ---------------------------------- ZIP ---------------------------------- */

export function ZipViewer({ blob }: { blob: Blob }) {
  const { data: entries, failed } = useParsed(blob, async (file) => {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    return Object.values(zip.files).map((entry) => ({
      name: entry.name,
      isFolder: entry.dir,
    }));
  });

  if (failed) return <Failed />;
  if (!entries) return <Status>Opening…</Status>;

  return (
    <div className="p-4">
      <p className="mb-3 text-sm text-gray-400">{entries.length} items in this archive</p>
      <ul className="space-y-1">
        {entries.map((e) => (
          <li key={e.name} className="flex items-center gap-2 break-all rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-300">
            {e.isFolder ? <FiFolder className="shrink-0 text-purple-400" /> : <FiFile className="shrink-0 text-purple-400" />}
            {e.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------- RTF ---------------------------------- */

function rtfToText(rtf: string) {
  return rtf
    .replace(/\{\\(?:fonttbl|colortbl|stylesheet|info|pict)[\s\S]*?\}\s*/g, "")
    .replace(/\\par[d]?\b ?/g, "\n")
    .replace(/\\tab\b ?/g, "\t")
    .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\u(-?\d+)\??/g, (_, code) => String.fromCharCode((Number(code) + 65536) % 65536))
    .replace(/\\[a-zA-Z]+-?\d* ?/g, "")
    .replace(/\\([{}\\])/g, "\u0000$1")
    .replace(/[{}]/g, "")
    .replace(/\u0000/g, "")
    .trim();
}

export function RtfViewer({ blob }: { blob: Blob }) {
  const { data: text, failed } = useParsed(blob, async (file) => rtfToText(await file.text()));
  if (failed) return <Failed />;
  if (text === undefined) return <Status>Opening…</Status>;
  return (
    <div className="p-3 sm:p-6">
      <pre className="uwl-doc mx-auto max-w-3xl whitespace-pre-wrap rounded p-5 font-sans text-sm shadow-lg sm:p-10">
        {text}
      </pre>
    </div>
  );
}
