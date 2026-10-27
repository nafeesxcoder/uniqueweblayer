import type { Metadata } from "next";
import AdminShell from "./AdminShell";
import Dashboard from "./Dashboard";

/**
 * Admin area — never indexed.
 *
 * robots.ts already disallows /admin/ for crawlers, and this adds the meta
 * noindex as a second layer in case the page is ever reached another way.
 */
export const metadata: Metadata = {
  title: "Admin — Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return (
    <AdminShell>
      <Dashboard />
    </AdminShell>
  );
}
