"use client";

import { useState } from "react";
import { ApiRequestError, requestPasswordReset } from "../lib/api";
import PasswordField from "./PasswordField";
import ModalPortal from "../components/ModalPortal";

/**
 * Sign-in, with the forgotten-password flow folded in rather than living on a
 * page of its own — it is two fields either way, and a separate page would
 * mean losing whatever you were in the middle of.
 *
 * `onClose` must actually go somewhere. It used to be handed an empty function
 * on /admin, so Cancel looked like a button and did nothing.
 */
export default function AdminLoginModal({
  onClose,
  onLogin,
  closeLabel = "Cancel",
}: {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<unknown>;
  closeLabel?: string;
}) {
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onLogin(email.trim(), password);
      // Deliberately no onClose() here. `onClose` means "I am leaving the
      // admin area" — calling it on success sent you to the home page the
      // instant you signed in. The parent unmounts this once the session
      // exists, which is the only thing that should close it.
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Sign in failed — try again",
      );
    } finally {
      setBusy(false);
    }
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await requestPasswordReset(email.trim());
      setSent(result.message);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not send the reset email — try again",
      );
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none";

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-100 flex items-center justify-center uwl-scrim backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signin" ? "Admin sign in" : "Reset admin password"}
    >
      <div
        className="uwl-modal w-full max-w-sm rounded-2xl border p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {mode === "signin" ? (
          <>
            <h2 className="text-xl font-bold text-white">Admin sign in</h2>
            <p className="mt-1.5 text-sm text-gray-400">
              Enquiries, projects and settings.
            </p>

            <form onSubmit={signIn} className="mt-6 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="username"
                required
                className={field}
              />
              <PasswordField
                value={password}
                onChange={setPassword}
                placeholder="Password"
                autoComplete="current-password"
              />

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? "Signing in…" : "Sign in"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
                >
                  {closeLabel}
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
              }}
              className="mt-5 w-full text-center text-sm text-purple-300 transition hover:text-purple-200"
            >
              Forgot password?
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white">Reset password</h2>
            <p className="mt-1.5 text-sm text-gray-400">
              We will email a link to the admin address. It works once and
              expires in 30 minutes.
            </p>

            {sent ? (
              <>
                <p className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-200">
                  {sent}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setSent("");
                  }}
                  className="mt-5 w-full rounded-xl border border-white/15 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
                >
                  Back to sign in
                </button>
              </>
            ) : (
              <form onSubmit={sendReset} className="mt-6 space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email"
                  autoComplete="username"
                  required
                  className={field}
                />

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={busy}
                    className="flex-1 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                  >
                    {busy ? "Sending…" : "Email me a link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError("");
                    }}
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
    </ModalPortal>
  );
}
