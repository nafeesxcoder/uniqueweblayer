"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Google Analytics 4.
 *
 * Loads only when NEXT_PUBLIC_GA_ID is set, so development and any deploy
 * without the key stay clean — no script, no cookies, nothing in the network
 * tab. That also means a page view from your own laptop never pollutes the
 * numbers while you are working on the site.
 *
 * App Router note: gtag counts one page view when the script loads, and after
 * that the browser never does a full page load again — moving between pages is
 * client-side. Without the effect below, every visit would look like one page
 * and you would never learn which service page people actually read. So the
 * automatic one is switched off and every view, including the first, is sent
 * from one place.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/**
 * Everything goes through dataLayer rather than window.gtag.
 *
 * dataLayer is a queue: anything pushed before Google's script finishes
 * loading is replayed once it arrives. Calling window.gtag instead would
 * silently drop the first page view of every visit, because the effect runs
 * before an afterInteractive script has loaded.
 */
function push(...args: unknown[]) {
  if (typeof window === "undefined" || !GA_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/**
 * Records something a visitor did. Safe to call anywhere — it does nothing
 * when analytics is off, and nothing reaches Google if the script is blocked.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  push("event", name, params);
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;

    const query = searchParams.toString();
    push("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          /* send_page_view off: the effect above sends every view, including
             the first, so leaving this on would double-count each visit. */
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
