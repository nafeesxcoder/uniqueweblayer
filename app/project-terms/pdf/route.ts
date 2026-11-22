import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { getTerms } from "../../lib/server/terms";
import { UPLOAD_DIR } from "../../lib/server/uploads";
import { DEFAULT_SIGNATURE } from "../../data/projectTerms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Standard PDF fonts only cover Latin text, so the rupee sign is spelled out. */
const plain = (text: string) => text.replace(/₹/g, "INR ");

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 54;
const CONTENT_W = PAGE_W - M * 2;
const PURPLE = rgb(0.42, 0.13, 0.85);
const PINK = rgb(0.86, 0.15, 0.47);
const INK = rgb(0.1, 0.07, 0.2);
const MUTED = rgb(0.4, 0.37, 0.5);
const LINE = rgb(0.88, 0.85, 0.94);
const TINT = rgb(0.965, 0.95, 1);
const WHITE = rgb(1, 1, 1);

/** Purple to pink, drawn as thin slices because pdf-lib has no gradient fill. */
function gradientBar(page: PDFPage, x: number, y: number, width: number, height: number) {
  const slices = 90;
  const step = width / slices;
  for (let i = 0; i < slices; i++) {
    const t = i / (slices - 1);
    page.drawRectangle({
      x: x + i * step,
      y,
      width: step + 0.5,
      height,
      color: rgb(
        0.42 + (0.86 - 0.42) * t,
        0.13 + (0.15 - 0.13) * t,
        0.85 + (0.47 - 0.85) * t,
      ),
    });
  }
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = plain(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadPublic(relative: string): Buffer | null {
  const full = path.join(process.cwd(), "public", relative);
  return existsSync(full) ? readFileSync(full) : null;
}

function loadSignature(relative: string): Buffer | null {
  if (!relative) return loadPublic(DEFAULT_SIGNATURE.replace(/^\//, ""));
  if (relative.startsWith("/uploads/")) {
    const full = path.join(UPLOAD_DIR, relative.replace("/uploads/", ""));
    return existsSync(full) ? readFileSync(full) : null;
  }
  return loadPublic(relative.replace(/^\//, ""));
}

export async function GET() {
  const terms = await getTerms();
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const logoBytes = loadPublic("logo-light.png");
  const logo: PDFImage | null = logoBytes ? await pdf.embedPng(logoBytes) : null;
  const sigBytes = loadSignature(terms.signature);
  const signature: PDFImage | null = sigBytes ? await pdf.embedPng(sigBytes) : null;

  let page: PDFPage;
  let y = 0;

  const runningHeader = () => {
    gradientBar(page, 0, PAGE_H - 5, PAGE_W, 5);
    page.drawText("Unique Web Layer  ·  Project Terms", {
      x: M,
      y: PAGE_H - 30,
      size: 8,
      font: bold,
      color: PURPLE,
    });
  };

  const newPage = (first = false) => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    if (!first) runningHeader();
    y = PAGE_H - 62;
  };

  const ensure = (needed: number) => {
    if (y - needed < 64) newPage();
  };

  const text = (value: string, font: PDFFont, size: number, color = INK, gap = 4, x = M, width = CONTENT_W) => {
    for (const line of wrap(value, font, size, width)) {
      ensure(size + gap);
      page.drawText(line, { x, y: y - size, size, font, color });
      y -= size + gap;
    }
  };

  const heading = (value: string) => {
    ensure(32);
    page.drawRectangle({ x: M, y: y - 14, width: 3, height: 14, color: PINK });
    page.drawText(value, { x: M + 10, y: y - 12, size: 13, font: bold, color: INK });
    y -= 30;
  };

  // ---- First page: brand, title, notice --------------------------------
  newPage(true);
  if (logo) {
    const w = 150;
    const h = (w * logo.height) / logo.width;
    page.drawImage(logo, { x: M, y: PAGE_H - 30 - h + 6, width: w, height: h });
  }
  const meta = `Updated ${plain(terms.updated)}`;
  page.drawText("PROJECT TERMS", {
    x: PAGE_W - M - bold.widthOfTextAtSize("PROJECT TERMS", 8),
    y: PAGE_H - 36,
    size: 8,
    font: bold,
    color: PURPLE,
  });
  page.drawText(meta, {
    x: PAGE_W - M - regular.widthOfTextAtSize(meta, 8),
    y: PAGE_H - 48,
    size: 8,
    font: regular,
    color: MUTED,
  });

  y = PAGE_H - 118;
  text("Payment, hosting and how we work", bold, 24, INK, 6);
  y -= 6;

  const noticeLines = wrap(terms.notice, regular, 9.5, CONTENT_W - 28);
  const noticeH = noticeLines.length * 13.5 + 20;
  page.drawRectangle({ x: M, y: y - noticeH, width: CONTENT_W, height: noticeH, color: TINT, borderColor: LINE, borderWidth: 0.8 });
  page.drawRectangle({ x: M, y: y - noticeH, width: 3, height: noticeH, color: PURPLE });
  let ny = y - 14;
  for (const line of noticeLines) {
    page.drawText(line, { x: M + 16, y: ny - 9.5, size: 9.5, font: regular, color: MUTED });
    ny -= 13.5;
  }
  y -= noticeH + 22;

  // ---- Payment stages -----------------------------------------------------
  heading("Payment at each stage");
  const stages = terms.stages;
  const gap = 12;
  const cardW = (CONTENT_W - gap * (stages.length - 1)) / stages.length;
  const bodyLines = Math.max(...stages.map((s) => wrap(s.gets, regular, 9, cardW - 24).length));
  const cardH = 16 + 26 + 16 + 12 + bodyLines * 12 + 14;
  ensure(cardH + 30);
  stages.forEach((stage, i) => {
    const x = M + i * (cardW + gap);
    const top = y;
    page.drawRectangle({ x, y: top - cardH, width: cardW, height: cardH, color: TINT, borderColor: LINE, borderWidth: 0.8 });
    page.drawRectangle({ x, y: top - 3, width: cardW, height: 3, color: PURPLE });
    page.drawText(`${stage.percent}%`, { x: x + 12, y: top - 16 - 22, size: 22, font: bold, color: PURPLE });
    page.drawText(plain(stage.label), { x: x + 12, y: top - 16 - 26 - 14, size: 10, font: bold, color: INK });
    wrap(stage.gets, regular, 9, cardW - 24).forEach((line, n) => {
      page.drawText(line, { x: x + 12, y: top - 16 - 26 - 16 - 12 - n * 12 - 9, size: 9, font: regular, color: MUTED });
    });
  });
  y -= cardH + 10;
  text(`For projects above ${terms.largeThreshold}. Smaller projects pay ${terms.smallSplit}.`, regular, 9, MUTED, 4);
  y -= 8;

  // ---- Sections -------------------------------------------------------------
  terms.sections.forEach((section, si) => {
    ensure(70);
    const number = String(si + 1).padStart(2, "0");
    const numW = bold.widthOfTextAtSize(number, 7.5);
    page.drawCircle({ x: M + 9, y: y - 8, size: 9, color: PURPLE });
    page.drawText(number, { x: M + 9 - numW / 2, y: y - 10.5, size: 7.5, font: bold, color: WHITE });
    page.drawText(plain(section.title), { x: M + 26, y: y - 12, size: 13, font: bold, color: INK });
    y -= 26;
    page.drawLine({ start: { x: M, y: y }, end: { x: PAGE_W - M, y: y }, thickness: 0.6, color: LINE });
    y -= 12;

    for (const point of section.points) {
      const lines = wrap(point, regular, 9.5, CONTENT_W - 16);
      ensure(lines.length * 13.5 + 6);
      page.drawCircle({ x: M + 4, y: y - 5.2, size: 2.2, color: PURPLE });
      lines.forEach((line, n) => {
        page.drawText(line, { x: M + 16, y: y - 9.5 - n * 13.5, size: 9.5, font: regular, color: INK });
      });
      y -= lines.length * 13.5 + 6;
    }
    y -= 12;
  });

  // ---- Founder signature and client acceptance ------------------------------
  ensure(190);
  y -= 6;
  page.drawLine({ start: { x: M, y: y }, end: { x: PAGE_W - M, y: y }, thickness: 0.6, color: LINE });
  y -= 22;

  const colGap = 24;
  const colW = (CONTENT_W - colGap) / 2;
  const leftX = M;
  const rightX = M + colW + colGap;
  const top = y;

  page.drawText("FOR UNIQUE WEB LAYER", { x: leftX, y: top - 10, size: 8, font: bold, color: PURPLE });
  if (signature) {
    const sigH = 88;
    const sigW = (sigH * signature.width) / signature.height;
    page.drawImage(signature, { x: leftX + 2, y: top - 22 - sigH, width: sigW, height: sigH });
  }
  const lineY = top - 22 - 88 - 6;
  page.drawLine({ start: { x: leftX, y: lineY }, end: { x: leftX + colW - 30, y: lineY }, thickness: 0.7, color: INK });
  page.drawText(plain(terms.signedBy), { x: leftX, y: lineY - 16, size: 11, font: bold, color: INK });
  page.drawText(plain(terms.signedRole), { x: leftX, y: lineY - 30, size: 9, font: regular, color: MUTED });
  page.drawText(`Date: ${plain(terms.updated)}`, { x: leftX, y: lineY - 44, size: 9, font: regular, color: MUTED });

  page.drawText("ACCEPTED BY CLIENT", { x: rightX, y: top - 10, size: 8, font: bold, color: PURPLE });
  ["Name", "Signature", "Date"].forEach((label, i) => {
    const fieldY = top - 56 - i * 38;
    page.drawLine({ start: { x: rightX, y: fieldY }, end: { x: rightX + colW, y: fieldY }, thickness: 0.7, color: INK });
    page.drawText(label, { x: rightX, y: fieldY - 11, size: 8, font: regular, color: MUTED });
  });

  // ---- Footers on every page -------------------------------------------------
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M, y: 44 }, end: { x: PAGE_W - M, y: 44 }, thickness: 0.5, color: LINE });
    p.drawText("Unique Web Layer  ·  uniqueweblayer.com", { x: M, y: 30, size: 8, font: regular, color: MUTED });
    const label = `Page ${i + 1} of ${pages.length}`;
    p.drawText(label, { x: PAGE_W - M - regular.widthOfTextAtSize(label, 8), y: 30, size: 8, font: regular, color: MUTED });
  });

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Unique-Web-Layer-Project-Terms.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
