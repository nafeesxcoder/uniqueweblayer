import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminProducts from "../AdminProducts";

export const metadata: Metadata = {
  title: "Admin — Collaborations",
  robots: { index: false, follow: false, nocache: true },
};

export default function ProductsAdminPage() {
  return (
    <AdminShell>
      <AdminProducts />
    </AdminShell>
  );
}
