import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminDocuments from "../AdminDocuments";

export const metadata: Metadata = {
  title: "Admin — Documents",
  robots: { index: false, follow: false, nocache: true },
};

export default function DocumentsPage() {
  return (
    <AdminShell>
      <AdminDocuments />
    </AdminShell>
  );
}
