"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "./AdminShell";
import ProductModal from "./ProductModal";
import {
  deleteProductRequest,
  fetchProducts,
  ApiRequestError,
} from "../lib/api";
import { PRODUCT_STATUS_LABEL, type Product } from "../lib/productTypes";

export default function AdminProducts() {
  const { token } = useAdminSession();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchProducts(token, true));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not load projects.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"?\n\nIts page is removed from the site. This cannot be undone.`)) return;
    setError("");
    try {
      await deleteProductRequest(p.id, token);
      setItems((prev) => prev.filter((x) => x.id !== p.id));
      setNotice(`${p.name} deleted.`);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not delete that project.");
    }
  };

  const onSaved = (saved: Product, mode: "created" | "updated") => {
    setItems((prev) =>
      (mode === "created" ? [...prev, saved] : prev.map((x) => (x.id === saved.id ? saved : x))).sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ),
    );
    setShowForm(false);
    setEditing(null);
    setNotice(`${saved.name} ${mode === "created" ? "added" : "updated"}.`);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Collaborations</h1>
          <p className="mt-2 text-sm text-gray-400">
            {items.length} saved · {items.filter((p) => p.isPublished).length} showing on the site
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white"
        >
          + Add project
        </button>
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
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-purple-500/25 px-6 py-16 text-center text-gray-400">
          No collaboration projects yet. Add your first one.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id} className="uwl-panel flex flex-wrap items-center gap-4 rounded-2xl border p-5">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                style={{ background: p.logo ? "#ffffff" : p.brandColor }}
              >
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo} alt={`${p.name} logo`} className="h-full w-full object-contain p-1" />
                ) : (
                  <b style={{ color: "#ffffff" }}>{p.name.charAt(0)}</b>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white">{p.name}</span>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase text-emerald-300">
                    {PRODUCT_STATUS_LABEL[p.status]}
                  </span>
                  {!p.isPublished && (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase text-amber-300">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-gray-400">{p.tagline}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {p.gallery.length} screenshots · {p.content.features.length} features · order {p.sortOrder}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {p.isPublished && (
                  <a
                    href={`/collaborations/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/5"
                  >
                    View
                  </a>
                )}
                <button
                  onClick={() => {
                    setEditing(p);
                    setShowForm(true);
                  }}
                  className="rounded-full border border-purple-400/40 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-600/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => void remove(p)}
                  className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <ProductModal
          token={token}
          product={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
