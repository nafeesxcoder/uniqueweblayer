"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades and lifts its children into place once they scroll into view.
 * Content is visible if JavaScript never runs, and motion is skipped for
 * visitors who ask for reduced motion.
 */
export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="uwl-reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
