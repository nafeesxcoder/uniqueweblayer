import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminInsights from "../AdminInsights";

export const metadata: Metadata = {
  title: "Admin — Insights",
  robots: { index: false, follow: false, nocache: true },
};

export default function InsightsPage() {
  return (
    <AdminShell>
      <AdminInsights />
    </AdminShell>
  );
}
