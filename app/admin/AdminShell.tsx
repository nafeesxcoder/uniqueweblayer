"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiInbox,
  FiFolder,
  FiMessageSquare,
  FiTag,
  FiFile,
  FiBarChart2,
  FiSettings,
  FiMoreHorizontal,
  FiExternalLink,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import AdminLoginModal from "./AdminLoginModal";
import { useAdminAuth } from "../lib/useAdminAuth";
import { fetchBadges } from "../lib/api";

/**
 * The frame every admin page sits in.
 *
 * One sign-in gate and one session for the whole area: each page used to run
 * its own auth check, so the login box appeared once per page and the token
 * was re-verified on every navigation.
 *
 * The shape is different on each screen because the two situations are
 * different. On a laptop there is room for a rail that shows where you are
 * and what is waiting, all the time. On a phone there is not, so the
 * navigation moves to the thumb: a bar along the bottom with the four screens
 * actually opened day to day, and the rest behind More.
 *
 * ClientLayout leaves out the public header, footer and starfield here — this
 * is a tool, and it gets the whole window.
 */

type Session = { token: string; email: string | null; logout: () => void };

const SessionContext = createContext<Session | null>(null);

export function useAdminSession(): Session {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useAdminSession must be used inside <AdminShell>");
  }
  return session;
}

type NavItem = {
  href: string;
  label: string;
  icon: IconType;
  exact?: boolean;
  /** Which count, if any, belongs beside this item. */
  badge?: "unread" | "drafts";
  /** On a phone, the four you reach for; the rest live behind More. */
  primary?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true, primary: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: FiInbox, badge: "unread", primary: true },
  { href: "/admin/projects", label: "Projects", icon: FiFolder, badge: "drafts", primary: true },
  { href: "/admin/documents", label: "Documents", icon: FiFile, primary: true },
  { href: "/admin/insights", label: "Insights", icon: FiBarChart2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: FiMessageSquare },
  { href: "/admin/pricing", label: "Pricing", icon: FiTag },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

const isActive = (pathname: string, item: NavItem) =>
  item.exact ? pathname === item.href : pathname.startsWith(item.href);

export default function AdminShell({ children }: { children: ReactNode }) {
  const { token, email, isAdmin, checking, login, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [badges, setBadges] = useState({ unread: 0, drafts: 0 });
  const [moreOpen, setMoreOpen] = useState(false);

  const loadBadges = useCallback(async () => {
    if (!token) return;
    try {
      setBadges(await fetchBadges(token));
    } catch {
      /* a count is not worth an error banner */
    }
  }, [token]);

  // Re-read on every navigation: read an enquiry and the badge should drop.
  useEffect(() => {
    void loadBadges();
  }, [loadBadges, pathname]);

  // The sheet is a phone thing; closing it on navigation is what makes it feel
  // like a native tab bar rather than a menu you have to dismiss.
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)]">
        <p className="text-sm text-gray-500">Checking your session…</p>
      </div>
    );
  }

  if (!isAdmin || !token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--admin-bg)] px-6 text-center">
        <h1 className="text-2xl font-semibold text-white">Admin</h1>
        <p className="mt-2 text-sm text-gray-400">
          Sign in to read enquiries and manage the site.
        </p>
        {/* Cancel leaves the admin area rather than doing nothing. */}
        <AdminLoginModal
          onClose={() => router.push("/")}
          onLogin={login}
          closeLabel="Back to site"
        />
      </div>
    );
  }

  const current = NAV.find((item) => isActive(pathname, item));
  const primary = NAV.filter((item) => item.primary);
  const secondary = NAV.filter((item) => !item.primary);
  const countFor = (item: NavItem) => (item.badge ? badges[item.badge] : 0);

  return (
    <SessionContext.Provider value={{ token, email, logout }}>
      <div className="min-h-screen bg-[var(--admin-bg)]">
        {/* ---------------------------- sidebar --------------------------- */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-[var(--admin-line)] bg-[var(--admin-panel)] lg:flex">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-5 py-6 text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-pink-600 text-sm font-bold">
              U
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Unique Web Layer
            </span>
          </Link>

          <nav className="flex-1 space-y-0.5 px-3">
            {NAV.map((item) => {
              const active = isActive(pathname, item);
              const count = countFor(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-purple-500/12 font-medium text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {/* A flush marker, not a pill — it reads as position in a rail */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-linear-to-b from-purple-500 to-pink-500" />
                  )}
                  <Icon
                    className={`h-4 w-4 shrink-0 ${active ? "text-purple-300" : ""}`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {count > 0 && (
                    <span className="rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-purple-200">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--admin-line)] p-3">
            {email && (
              <p className="truncate px-3 pb-2 text-xs text-gray-500">{email}</p>
            )}
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <FiExternalLink className="h-4 w-4" />
              View site
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <FiLogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* --------------------------- phone header ------------------------ */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--admin-line)] bg-[var(--admin-panel)]/95 px-4 py-3 backdrop-blur lg:hidden">
          <span className="text-base font-semibold text-white">
            {current?.label || "Admin"}
          </span>
          <Link
            href="/"
            className="rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:text-white"
          >
            View site
          </Link>
        </header>

        {/* ----------------------------- content --------------------------- */}
        {/* pb-24 keeps the last row clear of the tab bar on a phone */}
        <main className="px-4 pb-24 pt-6 sm:px-6 lg:ml-60 lg:px-10 lg:pb-12 lg:pt-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>

        {/* ---------------------------- tab bar ---------------------------- */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--admin-line)] bg-[var(--admin-panel)]/95 backdrop-blur lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {primary.map((item) => {
              const active = isActive(pathname, item);
              const count = countFor(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] transition ${
                    active ? "text-white" : "text-gray-500"
                  }`}
                >
                  <span className="relative">
                    <Icon
                      className={`h-5 w-5 ${active ? "text-purple-300" : ""}`}
                    />
                    {count > 0 && (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-1 text-[9px] font-bold text-white">
                        {count}
                      </span>
                    )}
                  </span>
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-5 top-0 h-0.5 rounded-b bg-linear-to-r from-purple-500 to-pink-500" />
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] transition ${
                secondary.some((item) => isActive(pathname, item))
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              <FiMoreHorizontal className="h-5 w-5" />
              More
            </button>
          </div>
        </nav>

        {/* ------------------------- more, as a sheet ---------------------- */}
        {moreOpen && (
          <div
            className="fixed inset-0 z-40 flex items-end bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMoreOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="More admin screens"
          >
            <div
              className="w-full rounded-t-2xl border-t border-[var(--admin-line)] bg-[var(--admin-panel)] p-4 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">More</span>
                <button
                  onClick={() => setMoreOpen(false)}
                  aria-label="Close"
                  className="rounded-lg p-1 text-gray-500 transition hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1">
                {secondary.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                        isActive(pathname, item)
                          ? "bg-purple-500/12 text-white"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-white/5"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>

              {email && (
                <p className="mt-3 truncate px-3 text-xs text-gray-500">
                  {email}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </SessionContext.Provider>
  );
}
