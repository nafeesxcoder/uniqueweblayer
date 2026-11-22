import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  LARGE_PROJECT_THRESHOLD,
  TERMS_UPDATED,
  paymentStages,
  termsNotice,
  termsSections,
} from "../../data/projectTerms";

export const runtime = "nodejs";

/** Standard PDF fonts only cover Latin text, so the rupee sign is spelled out. */
const plain = (text: string) => text.replace(/₹/g, "INR ");

const MARGIN = 56;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const INK = rgb(0.1, 0.07, 0.2);
const MUTED = rgb(0.4, 0.37, 0.5);
const ACCENT = rgb(0.42, 0.13, 0.85);

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = plain(text).split(/\s+/);
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

export async function GET() {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const contentWidth = PAGE_WIDTH - MARGIN * 2;

  let page: PDFPage = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ensure = (needed: number) => {
    if (y - needed < MARGIN) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  const text = (value: string, font: PDFFont, size: number, color = INK, gap = 4) => {
    for (const line of wrap(value, font, size, contentWidth)) {
      ensure(size + gap);
      page.drawText(line, { x: MARGIN, y: y - size, size, font, color });
      y -= size + gap;
    }
  };

  text("Unique Web Layer", bold, 11, ACCENT, 2);
  text("Project Terms, Payment and Hosting", bold, 20, INK, 8);
  text(`Last updated: ${TERMS_UPDATED}`, regular, 9, MUTED, 14);

  text("Payment at each stage", bold, 13, INK, 6);
  text(
    `For projects above ${LARGE_PROJECT_THRESHOLD}, payments follow this schedule:`,
    regular,
    10,
    INK,
    6,
  );
  for (const stage of paymentStages) {
    text(`${stage.percent}% ${stage.label}: ${stage.gets}`, regular, 10, INK, 4);
  }
  y -= 8;

  for (const section of termsSections) {
    ensure(40);
    text(section.title, bold, 13, INK, 6);
    for (const point of section.points) {
      text(`- ${point}`, regular, 10, INK, 4);
    }
    y -= 10;
  }

  text(termsNotice, regular, 9, MUTED, 4);

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Unique-Web-Layer-Project-Terms.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
