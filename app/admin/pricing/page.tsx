import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminPricing from "../AdminPricing";

export const metadata: Metadata = {
  title: "Admin — Pricing",
  robots: { index: false, follow: false, nocache: true },
};

export default function PricingPage() {
  return (
    <AdminShell>
      <AdminPricing />
    </AdminShell>
  );
}
