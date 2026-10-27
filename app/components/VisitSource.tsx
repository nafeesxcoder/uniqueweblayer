"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Remembers how this visit started.
 *
 * Two things, written once per browser tab and read again when the contact
 * form is submitted:
 *
 *   uwl_landing   the first page of the visit
 *   uwl_referrer  the site that sent them, if any
 *
 * They are kept in sessionStorage rather than a cookie: no banner is needed,
 * nothing persists after the tab closes, and nothing is sent anywhere until
 * the visitor chooses to submit the form.
 *
 * The first page is the one that matters. Someone who lands on
 * /services/restaurant and then clicks through to /contact was brought in by
 * the restaurant page — recording /contact would credit the wrong page and
 * make every enquiry look the same.
 */

export const LANDING_KEY = "uwl_landing";
export const REFERRER_KEY = "uwl_referrer";

export function readVisitSource() {
  try {
    return {
      landingPage: sessionStorage.getItem(LANDING_KEY) || "",
      referrer: sessionStorage.getItem(REFERRER_KEY) || "",
    };
  } catch {
    // Private mode, or storage blocked — the enquiry is still worth sending.
    return { landingPage: "", referrer: "" };
  }
}

export default function VisitSource() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(LANDING_KEY)) return;

      sessionStorage.setItem(
        LANDING_KEY,
        pathname + (window.location.search || ""),
      );

      // Only an outside referrer is worth recording; our own pages are noise.
      const ref = document.referrer;
      if (ref && !ref.startsWith(window.location.origin)) {
        sessionStorage.setItem(REFERRER_KEY, ref.slice(0, 400));
      }
    } catch {
      /* storage unavailable — carry on without it */
    }
  }, [pathname]);

  return null;
}
