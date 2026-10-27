import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminInbox from "../AdminInbox";

export const metadata: Metadata = {
  title: "Admin — Enquiries",
  robots: { index: false, follow: false, nocache: true },
};

export default function EnquiriesPage() {
  return (
    <AdminShell>
      <AdminInbox />
    </AdminShell>
  );
}
