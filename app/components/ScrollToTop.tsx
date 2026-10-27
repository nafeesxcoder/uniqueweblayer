"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

/**
 * Back-to-top button. Appears once the visitor has scrolled past one screen,
 * and shows how far down the page they are as a ring around the arrow.
 *
 * Sits bottom-LEFT so it never collides with the WhatsApp button
 * on the right.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      // Throttle to one update per animation frame — scroll fires very often.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const scrolled = window.scrollY;
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        setVisible(scrolled > window.innerHeight * 0.8);
        setProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 left-6 z-[90] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        background: `conic-gradient(#a855f7 ${progress}%, rgba(255,255,255,0.12) ${progress}% 100%)`,
      }}
    >
      <span className="absolute inset-[3px] rounded-full bg-black/85 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center">
        <FiArrowUp className="w-4 h-4 text-purple-300" />
      </span>
    </button>
  );
}
