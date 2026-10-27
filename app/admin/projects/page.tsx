import type { Metadata } from "next";
import { Suspense } from "react";
import AdminShell from "../AdminShell";
import AdminProjects from "../AdminProjects";

export const metadata: Metadata = {
  title: "Admin — Projects",
  robots: { index: false, follow: false, nocache: true },
};

export default function ProjectsPage() {
  return (
    <AdminShell>
      {/* useSearchParams needs a boundary for the static shell to prerender. */}
      <Suspense fallback={<p className="py-20 text-center text-gray-500">Loading…</p>}>
        <AdminProjects />
      </Suspense>
    </AdminShell>
  );
}
