import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminTerms from "../AdminTerms";

export const metadata: Metadata = {
  title: "Admin — Project terms",
  robots: { index: false, follow: false, nocache: true },
};

export default function TermsAdminPage() {
  return (
    <AdminShell>
      <AdminTerms />
    </AdminShell>
  );
}
