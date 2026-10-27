"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type Theme = "dark" | "light";

/**
 * Dark / light switch.
 *
 * The theme is applied by setting data-theme on <html>; globals.css redefines the
 * Tailwind colour variables for the light side. The choice is remembered in
 * localStorage, and the inline script in app/layout.tsx applies it before first
 * paint so there is no white flash on load.
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("uwl_theme", next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  };

  // Render a placeholder of the same size until mounted, so the header doesn't shift.
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 block ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`group relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#b665f2] hover:border-purple-500/50 transition-all duration-300 ${className}`}
    >
      {isDark ? (
        <FiSun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <FiMoon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
