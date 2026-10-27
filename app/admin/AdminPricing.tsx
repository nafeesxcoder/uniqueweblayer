"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminSession } from "./AdminShell";
import {
  fetchPricing,
  setServicePrice,
  resetServicePrice,
  ApiRequestError,
  type ServicePrice,
} from "../lib/api";

/**
 * Prices, editable per service.
 *
 * They used to be typed into three separate files — the service list, each
 * service page and the home page section — and had drifted apart, so the same
 * service showed a different price depending on where a visitor looked. Every
 * one of those places now reads the value shown here.
 *
 * Each row edits in place. "Reset" drops the saved value and goes back to the
 * price written in the code, which is why a service with no override is not
 * an error state — it is the normal one.
 */

type Draft = { price: string; delivery: string };

export default function AdminPricing() {
  const { token } = useAdminSession();

  const [rows, setRows] = useState<ServicePrice[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchPricing();
      setRows(list);
      setDrafts(
        Object.fromEntries(
          list.map((r) => [r.slug, { price: r.price, delivery: r.delivery }]),
        ),
      );
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Could not load prices.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(() => {
    const map = new Map<string, ServicePrice[]>();
    for (const row of rows) {
      const list = map.get(row.category) || [];
      list.push(row);
      map.set(row.category, list);
    }
    return [...map.entries()];
  }, [rows]);

  const isDirty = (row: ServicePrice) => {
    const d = drafts[row.slug];
    return Boolean(d) && (d.price !== row.price || d.delivery !== row.delivery);
  };

  const edit = (slug: string, field: keyof Draft, value: string) =>
    setDrafts((prev) => ({ ...prev, [slug]: { ...prev[slug], [field]: value } }));

  const save = async (row: ServicePrice) => {
    const draft = drafts[row.slug];
    if (!draft) return;

    setSavingSlug(row.slug);
    setError("");
    setNotice("");
    try {
      const result = await setServicePrice(
        row.slug,
        { price: draft.price.trim(), delivery: draft.delivery.trim() },
        token,
      );
      setRows((prev) =>
        prev.map((r) =>
          r.slug === row.slug
            ? { ...r, ...result.pricing, isCustom: true }
            : r,
        ),
      );
      setNotice(`${row.name} is now ${result.pricing.price}.`);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Could not save that price.",
      );
    } finally {
      setSavingSlug(null);
    }
  };

  const reset = async (row: ServicePrice) => {
    setSavingSlug(row.slug);
    setError("");
    setNotice("");
    try {
      const result = await resetServicePrice(row.slug, token);
      setRows((prev) =>
        prev.map((r) =>
          r.slug === row.slug
            ? { ...r, ...result.pricing, isCustom: false }
            : r,
        ),
      );
      setDrafts((prev) => ({
        ...prev,
        [row.slug]: {
          price: result.pricing.price,
          delivery: result.pricing.delivery,
        },
      }));
      setNotice(`${row.name} is back to ${result.pricing.price}.`);
    } catch {
      setError("Could not reset that price.");
    } finally {
      setSavingSlug(null);
    }
  };

  const customCount = rows.filter((r) => r.isCustom).length;

  const field =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Pricing
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {rows.length} services · {customCount} changed from the default
        </p>
        <p className="mt-3 max-w-2xl text-sm text-gray-500">
          What you set here shows on the service page, the services list and the
          home page — all three read this one list. Write the price however you
          want it to appear, for example{" "}
          <code className="font-mono text-gray-400">$499</code>,{" "}
          <code className="font-mono text-gray-400">$299/mo</code> or{" "}
          <code className="font-mono text-gray-400">On request</code>.
        </p>
      </div>

      {notice && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-20 text-center text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-3 text-sm font-medium text-gray-400">
                {category}
              </h2>

              <ul className="space-y-2">
                {items.map((row) => {
                  const draft = drafts[row.slug] || {
                    price: row.price,
                    delivery: row.delivery,
                  };
                  const dirty = isDirty(row);
                  const busy = savingSlug === row.slug;

                  return (
                    <li
                      key={row.slug}
                      className="uwl-panel rounded-xl border p-4"
                    >
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="min-w-[180px] flex-1">
                          <p className="text-sm font-medium text-white">
                            {row.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            /services/{row.slug}
                            {row.isCustom && (
                              <span className="ml-2 text-purple-300">
                                · changed
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="w-32">
                          <label
                            htmlFor={`price-${row.slug}`}
                            className="mb-1 block text-[11px] text-gray-500"
                          >
                            Price
                          </label>
                          <input
                            id={`price-${row.slug}`}
                            value={draft.price}
                            onChange={(e) =>
                              edit(row.slug, "price", e.target.value)
                            }
                            className={field}
                          />
                        </div>

                        <div className="w-56">
                          <label
                            htmlFor={`delivery-${row.slug}`}
                            className="mb-1 block text-[11px] text-gray-500"
                          >
                            Delivery
                          </label>
                          <input
                            id={`delivery-${row.slug}`}
                            value={draft.delivery}
                            onChange={(e) =>
                              edit(row.slug, "delivery", e.target.value)
                            }
                            className={field}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => void save(row)}
                            disabled={!dirty || busy}
                            className="rounded-lg bg-linear-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {busy ? "Saving…" : "Save"}
                          </button>
                          {row.isCustom && (
                            <button
                              onClick={() => void reset(row)}
                              disabled={busy}
                              className="rounded-lg border border-white/15 px-3 py-2 text-xs text-gray-400 transition hover:text-white disabled:opacity-40"
                              title="Back to the price written in the code"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
