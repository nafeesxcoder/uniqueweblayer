import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminSettings from "../AdminSettings";

export const metadata: Metadata = {
  title: "Admin — Settings",
  robots: { index: false, follow: false, nocache: true },
};

export default function SettingsPage() {
  return (
    <AdminShell>
      <AdminSettings />
    </AdminShell>
  );
}
