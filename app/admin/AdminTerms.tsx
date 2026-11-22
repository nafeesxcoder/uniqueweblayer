"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useAdminSession } from "./AdminShell";
import {
  fetchTerms,
  saveTermsRequest,
  uploadTermsSignature,
  ApiRequestError,
} from "../lib/api";
import type { PaymentStage, TermsContent, TermsSection } from "../data/projectTerms";

const FIELD =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none";
const LABEL = "mb-1.5 block text-xs font-medium text-gray-400";
const BUTTON =
  "rounded-full border border-purple-400/40 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-600/10";

export default function AdminTerms() {
  const { token } = useAdminSession();
  const [terms, setTerms] = useState<TermsContent | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTerms()
      .then(setTerms)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Could not load the terms."));
  }, []);

  if (!terms) {
    return <p className="py-20 text-center text-gray-500">{error || "Loading…"}</p>;
  }

  const set = <K extends keyof TermsContent>(key: K, value: TermsContent[K]) =>
    setTerms((t) => (t ? { ...t, [key]: value } : t));

  const setStage = (i: number, patch: Partial<PaymentStage>) =>
    set("stages", terms.stages.map((s, n) => (n === i ? { ...s, ...patch } : s)));

  const setSection = (i: number, patch: Partial<TermsSection>) =>
    set("sections", terms.sections.map((s, n) => (n === i ? { ...s, ...patch } : s)));

  const moveSection = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= terms.sections.length) return;
    const next = [...terms.sections];
    [next[i], next[j]] = [next[j], next[i]];
    set("sections", next);
  };

  const pickSignature = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      set("signature", await uploadTermsSignature(file, token));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not upload the signature.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const saved = await saveTermsRequest(
        {
          ...terms,
          hostingIncludedYears: Number(terms.hostingIncludedYears) || 0,
          supportDays: Number(terms.supportDays) || 0,
          stages: terms.stages.map((s) => ({ ...s, percent: Number(s.percent) || 0 })),
        },
        token,
      );
      setTerms(saved);
      setNotice("Saved. The terms page, PDF and process page now show these changes.");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not save. Check the highlighted fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Project terms</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            This text appears on the public terms page, in the PDF clients download, and as the payment summary on the process page.
          </p>
        </div>
        <a href="/project-terms" target="_blank" rel="noopener noreferrer" className={BUTTON}>
          View page
        </a>
      </div>

      {notice && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{notice}</div>}
      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      <section className="uwl-panel space-y-5 rounded-2xl border p-6">
        <h2 className="font-semibold text-white">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Date shown on the page and PDF</label>
            <input className={FIELD} value={terms.updated} onChange={(e) => set("updated", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Large project above</label>
            <input className={FIELD} value={terms.largeThreshold} onChange={(e) => set("largeThreshold", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Small project payment</label>
            <input className={FIELD} value={terms.smallSplit} onChange={(e) => set("smallSplit", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Support after launch (days)</label>
            <input type="number" className={FIELD} value={terms.supportDays} onChange={(e) => set("supportDays", Number(e.target.value))} />
          </div>
          <div>
            <label className={LABEL}>Hosting included (years)</label>
            <input type="number" className={FIELD} value={terms.hostingIncludedYears} onChange={(e) => set("hostingIncludedYears", Number(e.target.value))} />
          </div>
          <div>
            <label className={LABEL}>Yearly renewal, Indian clients</label>
            <input className={FIELD} value={terms.renewalINR} onChange={(e) => set("renewalINR", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Yearly renewal, international clients</label>
            <input className={FIELD} value={terms.renewalUSD} onChange={(e) => set("renewalUSD", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={LABEL}>Note at the top of the page</label>
          <textarea rows={2} className={FIELD} value={terms.notice} onChange={(e) => set("notice", e.target.value)} />
        </div>
      </section>

      <section className="uwl-panel space-y-5 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Payment stages</h2>
          <button
            type="button"
            className={BUTTON}
            disabled={terms.stages.length >= 6}
            onClick={() => set("stages", [...terms.stages, { percent: 0, label: "", gets: "" }])}
          >
            + Add stage
          </button>
        </div>
        {terms.stages.map((stage, i) => (
          <div key={i} className="grid gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-[90px_1fr_2fr_auto]">
            <div>
              <label className={LABEL}>Percent</label>
              <input type="number" className={FIELD} value={stage.percent} onChange={(e) => setStage(i, { percent: Number(e.target.value) })} />
            </div>
            <div>
              <label className={LABEL}>Label</label>
              <input className={FIELD} value={stage.label} onChange={(e) => setStage(i, { label: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>What the client gets</label>
              <input className={FIELD} value={stage.gets} onChange={(e) => setStage(i, { gets: e.target.value })} />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="text-xs text-red-300 hover:text-red-200"
                disabled={terms.stages.length <= 1}
                onClick={() => set("stages", terms.stages.filter((_, n) => n !== i))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="uwl-panel space-y-5 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Sections</h2>
          <button
            type="button"
            className={BUTTON}
            onClick={() => set("sections", [...terms.sections, { title: "New section", points: [] }])}
          >
            + Add section
          </button>
        </div>
        <p className="text-xs text-gray-500">
          One point per line. Numbers in the text (days, amounts) are plain text, so update them here as well as above.
        </p>
        {terms.sections.map((section, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-white/10 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <input className={`${FIELD} min-w-[200px] flex-1`} value={section.title} onChange={(e) => setSection(i, { title: e.target.value })} />
              <button type="button" className={BUTTON} onClick={() => moveSection(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className={BUTTON} onClick={() => moveSection(i, 1)} disabled={i === terms.sections.length - 1}>↓</button>
              <button
                type="button"
                className="text-xs text-red-300 hover:text-red-200"
                onClick={() => set("sections", terms.sections.filter((_, n) => n !== i))}
              >
                Remove
              </button>
            </div>
            <textarea
              rows={Math.min(10, Math.max(3, section.points.length + 1))}
              className={FIELD}
              value={section.points.join("\n")}
              onChange={(e) => setSection(i, { points: e.target.value.split("\n") })}
            />
          </div>
        ))}
      </section>

      <section className="uwl-panel space-y-5 rounded-2xl border p-6">
        <h2 className="font-semibold text-white">Signature</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Name that signs</label>
            <input className={FIELD} value={terms.signedBy} onChange={(e) => set("signedBy", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Role under the name</label>
            <input className={FIELD} value={terms.signedRole} onChange={(e) => set("signedRole", e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-20 w-44 items-center justify-center rounded-xl border border-white/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={terms.signature || "/brand/founder-signature.png"} alt="Signature" className="max-h-16 max-w-[160px] object-contain" />
          </span>
          <label className={`${BUTTON} cursor-pointer`}>
            {uploading ? "Uploading…" : "Upload new signature"}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploading} onChange={(e) => void pickSignature(e)} />
          </label>
          {terms.signature && (
            <button type="button" className="text-xs text-gray-400 hover:text-white" onClick={() => set("signature", "")}>
              Use the built-in signature
            </button>
          )}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save terms"}
        </button>
      </div>
    </div>
  );
}
