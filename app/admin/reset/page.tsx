import type { Metadata } from "next";
import { Suspense } from "react";
import ResetForm from "./ResetForm";

export const metadata: Metadata = {
  title: "Admin — Reset password",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Deliberately outside AdminShell: someone resetting a password is, by
 * definition, the one person who cannot sign in.
 */
export default function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}
