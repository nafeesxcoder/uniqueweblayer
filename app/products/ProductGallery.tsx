"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import ModalPortal from "../components/ModalPortal";
import type { ProductShot } from "../lib/productTypes";

/** Screenshot grid; tapping one opens it large. */
export default function ProductGallery({
  shots,
  name,
}: {
  shots: ProductShot[];
  name: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => ((i ?? 0) + 1) % shots.length);
      if (e.key === "ArrowLeft")
        setOpen((i) => ((i ?? 0) - 1 + shots.length) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shots.length]);

  const current = open === null ? null : shots[open];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group overflow-hidden rounded-2xl border border-purple-500/30 bg-white text-left shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.caption || `${name} screenshot ${i + 1}`}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            {shot.caption && (
              <span className="block px-4 py-3 text-sm font-medium" style={{ color: "#2f2845" }}>
                {shot.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && open !== null && (
        <ModalPortal>
          <div
            className="uwl-scrim fixed inset-0 z-100 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${name} screenshot`}
            onClick={() => setOpen(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.caption || `${name} screenshot`}
              className="max-h-[88vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" aria-label="Close" className="absolute right-4 top-4 rounded-full p-2" style={{ background: "#ffffff", color: "#1a1233" }} onClick={() => setOpen(null)}>
              <FiX />
            </button>
            {shots.length > 1 && (
              <>
                <button type="button" aria-label="Previous" className="absolute left-3 rounded-full p-3" style={{ background: "#ffffff", color: "#1a1233" }} onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + shots.length) % shots.length); }}>
                  <FiChevronLeft />
                </button>
                <button type="button" aria-label="Next" className="absolute right-3 rounded-full p-3" style={{ background: "#ffffff", color: "#1a1233" }} onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % shots.length); }}>
                  <FiChevronRight />
                </button>
              </>
            )}
          </div>
        </ModalPortal>
      )}
    </>
  );
}
