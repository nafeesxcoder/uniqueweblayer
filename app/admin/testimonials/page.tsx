import type { Metadata } from "next";
import AdminShell from "../AdminShell";
import AdminTestimonials from "../AdminTestimonials";

export const metadata: Metadata = {
  title: "Admin — Testimonials",
  robots: { index: false, follow: false, nocache: true },
};

export default function TestimonialsPage() {
  return (
    <AdminShell>
      <AdminTestimonials />
    </AdminShell>
  );
}
