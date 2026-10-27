"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders its children at the end of <body>, outside whatever is around it.
 *
 * A dialog needs to sit above everything, and `z-index` alone cannot promise
 * that: any ancestor with its own z-index traps every descendant inside its
 * stacking context, however high they set theirs. The admin pages are wrapped
 * in `relative z-10`, so the form — at z-100 — still painted underneath the
 * site header at z-40 and lost its top edge behind it.
 *
 * Moving the dialog to <body> removes the question entirely: there is nothing
 * left to be trapped by. It renders only after mount, because the server has
 * no document to portal into.
 */
export default function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
