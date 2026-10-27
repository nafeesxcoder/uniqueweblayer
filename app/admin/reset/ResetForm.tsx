"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Stars } from "../../components/Stars";
import { resetPassword, ApiRequestError } from "../../lib/api";
import PasswordField from "../PasswordField";

/**
 * Where the emailed link lands. The token stays in the URL and is sent once,
 * with the new password; nothing about it is stored in this browser.
 */
export default function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("The two passwords do not match");
      return;
    }

    setBusy(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      // Straight to the sign-in screen, with the new password fresh in mind.
      setTimeout(() => router.push("/admin"), 2500);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not reset the password — try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black">
      <Stars />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6">
        <div className="uwl-panel rounded-2xl border p-7">
          <h1 className="text-xl font-bold text-white">Set a new password</h1>

          {!token ? (
            <>
              <p className="mt-3 text-sm text-gray-400">
                This link is missing its token. Open the link from the email
                exactly as it was sent, or ask for a new one.
              </p>
              <Link
                href="/admin"
                className="mt-6 inline-block rounded-xl border border-white/15 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Back to sign in
              </Link>
            </>
          ) : done ? (
            <>
              <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-200">
                Password changed. Taking you to the sign-in screen…
              </p>
              <Link
                href="/admin"
                className="mt-5 inline-block text-sm text-purple-300 hover:text-purple-200"
              >
                Go now
              </Link>
            </>
          ) : (
            <>
              <p className="mt-1.5 text-sm text-gray-400">
                This link works once and expires 30 minutes after it was sent.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <PasswordField
                  id="pw"
                  label="New password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  minLength={10}
                  hint="At least 10 characters."
                />

                <PasswordField
                  id="pw2"
                  label="Repeat new password"
                  value={confirm}
                  onChange={setConfirm}
                  autoComplete="new-password"
                />

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? "Saving…" : "Set new password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
