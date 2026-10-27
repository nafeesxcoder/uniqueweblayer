"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Navigation loader — deliberately NOT the intro splash.
 *
 * The App Router has no router.events, and `usePathname` only updates *after*
 * the new page is ready, which is too late to show anything. So the bar starts
 * on the click that begins the navigation and ends when the path actually
 * changes.
 *
 * Shows a thin gradient bar across the top plus a small "Loading" pill, so the
 * visitor knows the next page is coming. Nothing blocks the current page.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);

  /**
   * Next prefetches linked pages, so a cached navigation can finish in a few
   * milliseconds — the bar would appear and vanish within one frame, which
   * reads as "the loader only works sometimes". Holding it for this long
   * makes every page change show the same visible cue.
   */
  const MIN_VISIBLE_MS = 500;

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
  };

  const start = () => {
    clearAll();
    startedAt.current = Date.now();
    setActive(true);
    setProgress(12);

    // Creep toward 90% — never reach 100 until the page is actually there,
    // otherwise the bar lies about being finished.
    ticker.current = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.12));
    }, 180);

    // Safety net: if a navigation is cancelled the bar must not stick forever.
    timers.current.push(
      setTimeout(() => {
        clearAll();
        setActive(false);
        setProgress(0);
      }, 10000),
    );
  };

  const finish = () => {
    clearAll();

    const elapsed = Date.now() - startedAt.current;
    const hold = Math.max(0, MIN_VISIBLE_MS - elapsed);

    timers.current.push(
      setTimeout(() => {
        setProgress(100);
        timers.current.push(
          setTimeout(() => {
            setActive(false);
            setProgress(0);
          }, 300),
        );
      }, hold),
    );
  };

  /* Start on any click that will navigate within the site. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Let the browser handle modified clicks (new tab, download, etc.)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      // Skip mailto:, tel:, #anchors and anything off-site.
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      start();
    };

    // Capture phase, so it runs before Next's Link handler swallows the event.
    document.addEventListener("click", onClick, true);
    // Back / forward buttons navigate too.
    window.addEventListener("popstate", start);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", start);
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* The new path has rendered — close the bar. */
  useEffect(() => {
    if (active) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active) return null;

  return (
    <>
      {/* Top bar */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[9998] h-[3px]"
        role="progressbar"
        aria-label="Loading page"
        aria-busy="true"
      >
        <div
          className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
          style={{
            width: `${progress}%`,
            transition: "width 220ms ease-out",
          }}
        />
      </div>

      {/* Corner pill — the explicit "next page is opening" cue */}
      {/* Sits above the scroll-to-top button, which occupies bottom-6 left-6 */}
      <div className="pointer-events-none fixed bottom-24 left-6 z-[9998]">
        <div className="uwl-panel flex items-center gap-2.5 rounded-full border px-4 py-2 shadow-lg">
          <span className="relative flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
          </span>
          <span className="text-xs font-medium text-gray-300">Loading…</span>
        </div>
      </div>
    </>
  );
}
