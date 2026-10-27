"use client";

import { useEffect, useState } from "react";
import { useAdminSession } from "./AdminShell";
import PasswordField from "./PasswordField";
import {
  changePassword,
  fetchOverview,
  ApiRequestError,
  type AdminOverview,
} from "../lib/api";

/**
 * Settings — for now, the password and the facts worth knowing about the
 * account. Deliberately small: a settings page that lists things you cannot
 * change from it is just a worse version of the .env file.
 */

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSettings() {
  const { token, email, logout } = useAdminSession();

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchOverview(token).then(setOverview).catch(() => {});
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDone("");
    setFieldErrors({});

    if (next !== confirm) {
      setFieldErrors({ confirm: "The two passwords do not match" });
      return;
    }

    setBusy(true);
    try {
      const result = await changePassword(current, next, token);
      setDone(result.message);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setError("Could not change the password — try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const changedAt = formatDate(overview?.account.passwordChangedAt || null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Settings
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        Signed in as {email || overview?.account.email}
      </p>

      {/* Change password */}
      <section className="uwl-panel mt-8 rounded-2xl border p-6">
        <h2 className="text-lg font-semibold text-white">Change password</h2>
        <p className="mt-1.5 text-sm text-gray-400">
          {changedAt
            ? `Last changed ${changedAt}.`
            : "You are still using the password from .env.local. Setting one here " +
              "stores it in the database, and the .env value stops having any effect."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <PasswordField
            id="current"
            label="Current password"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
            error={fieldErrors.currentPassword}
          />

          <PasswordField
            id="next"
            label="New password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            minLength={10}
            error={fieldErrors.newPassword}
            hint="At least 10 characters. Length is what makes a password hard to guess — a long ordinary phrase beats a short one full of symbols."
          />

          <PasswordField
            id="confirm"
            label="Repeat new password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            error={fieldErrors.confirm}
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {done && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {done}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Change password"}
          </button>
        </form>
      </section>

      {/* Account facts */}
      <section className="uwl-panel mt-6 rounded-2xl border p-6">
        <h2 className="text-lg font-semibold text-white">Account</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Admin email</dt>
            <dd className="text-gray-300">{overview?.account.email || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Last sign-in</dt>
            <dd className="text-gray-300">
              {formatDate(overview?.account.lastLoginAt || null) || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Outgoing email</dt>
            <dd className={overview?.smtp.ok ? "text-emerald-300" : "text-amber-300"}>
              {overview ? (overview.smtp.ok ? "Working" : "Not working") : "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-gray-600">
          The admin email is read from ADMIN_EMAIL in .env.local on first run.
          Password resets are only ever sent to that address, so changing it
          means editing the env file and clearing the admin_account row.
        </p>
      </section>

      <section className="mt-6">
        <button
          onClick={logout}
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
        >
          Sign out of this browser
        </button>
      </section>
    </div>
  );
}
