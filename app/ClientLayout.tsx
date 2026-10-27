"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TopContactBar from "./components/TopContactBar";
import Preloader from "./components/Preloader";
import RouteProgress from "./components/RouteProgress";
import { Stars } from "./components/Stars";
import WhatsAppWrapper from "./components/WhatsAppWrapper";
import VisitSource from "./components/VisitSource";
import ScrollToTop from "./components/ScrollToTop";

/**
 * IMPORTANT (SEO): the page content is always rendered. The preloader sits on top
 * as an overlay and fades out. Previously the children were only mounted after a
 * 3 second timer, which meant Google — and the user's first paint — saw an empty
 * page. Never gate `children` behind the preloader again.
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Starts false so the server HTML and the first client render match.
  const [showPreloader, setShowPreloader] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const startPath = useRef(pathname);

  /**
   * /admin is your own workspace, not a sales page. The chat bubble and the
   * WhatsApp button float over the bottom-right corner, which is exactly where
   * the delete and reply controls sit, so they are left off here.
   */
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  /**
   * The intro splash plays on a FULL page load and nothing else.
   *
   * This component lives in the root layout, so the App Router keeps it
   * mounted across every in-site navigation — this effect runs exactly once
   * per real page load (typing the address, a refresh, or arriving from an
   * external link) and never when moving between pages. Moving between pages
   * gets RouteProgress instead.
   *
   * It deliberately does NOT use sessionStorage any more. The flag used to be
   * written in onComplete, roughly 3 seconds after the splash began, so a
   * visitor who clicked a link before it finished left the flag unwritten and
   * saw the splash again on their next load. Tying the splash to mount removes
   * the race entirely.
   */
  useEffect(() => {
    setMounted(true);

    /*
     * Skip the intro entirely if the visitor already did something before React
     * got here. The inline script in layout.tsx sets data-uwl-dismiss on the
     * first pointer or key event, which can easily land first on a slow load —
     * and starting an animation after someone has begun clicking is worse than
     * never showing it.
     */
    if (document.documentElement.hasAttribute("data-uwl-dismiss")) {
      document.documentElement.setAttribute("data-uwl-intro", "done");
      return;
    }

    setShowPreloader(true);
  }, []);

  /**
   * The splash owns its own timing and calls onComplete once its animation
   * and fade have finished. A timer here used to unmount it after 1400ms
   * while the component was still typing through a 4200ms sequence, so it
   * vanished mid-word and the exit animation never ran. Never race it again.
   */
  const handleIntroComplete = () => setShowPreloader(false);

  /**
   * Cut the intro short the moment the visitor does anything.
   *
   * The splash is a full-screen overlay. In development Next compiles each
   * route the first time it is opened, which can keep the splash on screen for
   * several seconds — long enough that a click lands during the intro and the
   * animation then plays over the page the visitor just asked for. Either
   * navigating or clicking means they are done looking at it.
   */
  useEffect(() => {
    if (!showPreloader) return;

    // They navigated while the intro was still running.
    if (pathname !== startPath.current) {
      setShowPreloader(false);
      return;
    }

    const dismiss = () => setShowPreloader(false);
    // Capture phase, so this fires even though the overlay sits on top.
    window.addEventListener("pointerdown", dismiss, { capture: true, once: true });
    window.addEventListener("keydown", dismiss, { capture: true, once: true });
    window.addEventListener("wheel", dismiss, { capture: true, once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", dismiss, { capture: true });
      window.removeEventListener("keydown", dismiss, { capture: true });
      window.removeEventListener("wheel", dismiss, { capture: true });
    };
  }, [showPreloader, pathname]);

  /*
   * The admin area is a tool, not a page of the site.
   *
   * It used to render inside the public chrome — contact bar, marketing nav,
   * footer, starfield — so the sales navigation sat above your own enquiries
   * and every screen started 7rem down the page. AdminShell brings its own
   * sidebar and its own background, so everything here is left out and the
   * dashboard gets the full window.
   */
  if (isAdmin) {
    return (
      <>
        {mounted && <RouteProgress />}
        {children}
      </>
    );
  }

  return (
    <>
      {/* Overlay only — it never blocks the content underneath from rendering */}
      {mounted && showPreloader && (
        <Preloader onComplete={handleIntroComplete} />
      )}

      {/* Thin top bar + corner pill while moving between pages */}
      {mounted && <RouteProgress />}

      {/* Remembers the first page of the visit, for the Insights report */}
      <VisitSource />

      <Stars />

      {/* TopContactBar — desktop only */}
      <div className="fixed top-0 left-0 w-full z-[100] hidden md:block">
        <TopContactBar />
      </div>

      {/* Header — fixed on both mobile and desktop */}
      <div className="fixed top-0 md:top-8 left-0 w-full z-40">
        <Header />
      </div>

      {/* Main content — mobile: header height, desktop: contact bar + header */}
      <main className="min-h-screen pt-16 md:pt-28">{children}</main>

      <Footer />
      <WhatsAppWrapper />
      <ScrollToTop />
    </>
  );
}
