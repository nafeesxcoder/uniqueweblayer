"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import ModalPortal from "../components/ModalPortal";
import {
  createProductRequest,
  updateProductRequest,
  uploadProductImage,
  ApiRequestError,
} from "../lib/api";
import {
  EMPTY_PRODUCT_CONTENT,
  type Product,
  type ProductContent,
  type ProductShot,
  type ProductStatus,
} from "../lib/productTypes";

/**
 * Add or edit a product.
 *
 * List sections are one item per line with `|` between the parts, so a new
 * product can be written or pasted without a separate form for every card.
 */
const lines = (text: string) =>
  text.split("\n").map((l) => l.trim()).filter(Boolean);
const parts = (line: string) => line.split("|").map((p) => p.trim());

const toPairs = (text: string) =>
  lines(text).map((l) => {
    const [title = "", ...rest] = parts(l);
    return { title, text: rest.join(" | ") };
  });

function buildContent(f: Record<SectionKey, string>): ProductContent {
  return {
    highlights: lines(f.highlights).map((l) => {
      const [value = "", label = ""] = parts(l);
      return { value, label };
    }),
    problems: toPairs(f.problems),
    features: toPairs(f.features),
    steps: toPairs(f.steps),
    audience: lines(f.audience),
    plans: lines(f.plans).map((l) => {
      const [name = "", price = "", note = "", items = ""] = parts(l);
      return {
        name,
        price,
        note,
        items: items.split(";").map((i) => i.trim()).filter(Boolean),
      };
    }),
    faqs: lines(f.faqs).map((l) => {
      const [question = "", ...rest] = parts(l);
      return { question, answer: rest.join(" | ") };
    }),
  };
}

function toText(c: ProductContent): Record<SectionKey, string> {
  const pair = (items: { title: string; text: string }[]) =>
    items.map((i) => `${i.title} | ${i.text}`).join("\n");
  return {
    highlights: c.highlights.map((h) => `${h.value} | ${h.label}`).join("\n"),
    problems: pair(c.problems),
    features: pair(c.features),
    steps: pair(c.steps),
    audience: c.audience.join("\n"),
    plans: c.plans
      .map((p) => `${p.name} | ${p.price} | ${p.note} | ${p.items.join("; ")}`)
      .join("\n"),
    faqs: c.faqs.map((q) => `${q.question} | ${q.answer}`).join("\n"),
  };
}

type SectionKey =
  | "highlights"
  | "problems"
  | "features"
  | "steps"
  | "audience"
  | "plans"
  | "faqs";

const SECTIONS: { key: SectionKey; label: string; hint: string; rows: number }[] = [
  { key: "highlights", label: "Highlights (4 stat cards)", hint: "Value | Label", rows: 4 },
  { key: "problems", label: "Problems it solves", hint: "Title | Description", rows: 3 },
  { key: "features", label: "Features", hint: "Title | Description", rows: 7 },
  { key: "steps", label: "How it works", hint: "Step title | Description", rows: 4 },
  { key: "audience", label: "Who it is for", hint: "One per line", rows: 4 },
  { key: "plans", label: "Pricing plans", hint: "Name | Price | Note | item; item; item", rows: 3 },
  { key: "faqs", label: "FAQs", hint: "Question | Answer", rows: 5 },
];

const FIELD =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none";
const LABEL = "mb-1.5 block text-xs font-medium text-gray-400";

export default function ProductModal({
  token,
  product,
  onClose,
  onSaved,
}: {
  token: string;
  product: Product | null;
  onClose: () => void;
  onSaved: (p: Product, mode: "created" | "updated") => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    tagline: product?.tagline || "",
    category: product?.category || "",
    summary: product?.summary || "",
    description: product?.description || "",
    status: (product?.status || "live") as ProductStatus,
    websiteUrl: product?.websiteUrl || "",
    androidUrl: product?.androidUrl || "",
    iosUrl: product?.iosUrl || "",
    ctaLabel: product?.ctaLabel || "Try now",
    brandColor: product?.brandColor || "#7c3aed",
    accentColor: product?.accentColor || "#ec4899",
    sortOrder: String(product?.sortOrder ?? 0),
    isPublished: product ? product.isPublished : true,
  });
  const [sections, setSections] = useState(() =>
    toText(product?.content || EMPTY_PRODUCT_CONTENT),
  );
  const [logo, setLogo] = useState(product?.logo || "");
  const [heroImage, setHeroImage] = useState(product?.heroImage || "");
  const [gallery, setGallery] = useState<ProductShot[]>(product?.gallery || []);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const upload = async (files: File[], done: (paths: string[]) => void) => {
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const paths: string[] = [];
      for (const file of files) paths.push(await uploadProductImage(file, token));
      done(paths);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not upload that image.");
    } finally {
      setUploading(false);
    }
  };

  const picked = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    return files;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setFieldErrors({});
    const payload = {
      ...form,
      name: form.name.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      logo,
      heroImage,
      gallery,
      content: buildContent(sections),
    };
    try {
      const saved = product
        ? await updateProductRequest(product.id, payload, token)
        : await createProductRequest(payload, token);
      onSaved(saved, product ? "updated" : "created");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setError("Could not save that. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const text = (key: "name" | "tagline" | "category" | "websiteUrl" | "androidUrl" | "iosUrl" | "ctaLabel", label: string, required = false, placeholder = "") => (
    <div>
      <label htmlFor={`p-${key}`} className={LABEL}>
        {label}
        {required ? " *" : ""}
      </label>
      <input id={`p-${key}`} value={form[key]} required={required} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} className={FIELD} />
      {fieldErrors[key] && <p className="mt-1 text-xs text-red-400">{fieldErrors[key]}</p>}
    </div>
  );

  const imageBox = (label: string, value: string, onChange: (v: string) => void) => (
    <div>
      <span className={LABEL}>{label}</span>
      <div className="flex items-center gap-3">
        <span className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10" style={{ background: "#ffffff" }}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="h-full w-full object-contain" />
          ) : (
            <span className="text-[10px]" style={{ color: "#6b6383" }}>None</span>
          )}
        </span>
        <label className="cursor-pointer rounded-lg border border-purple-400/40 px-3 py-2 text-xs text-purple-200 hover:bg-purple-600/10">
          {value ? "Change" : "Upload"}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" disabled={uploading} className="sr-only" onChange={(e) => void upload(picked(e).slice(0, 1), ([p]) => onChange(p))} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-300">Remove</button>
        )}
      </div>
    </div>
  );

  return (
    <ModalPortal>
      <div className="uwl-scrim fixed inset-0 z-100 flex items-start justify-center overflow-y-auto overscroll-contain p-4 backdrop-blur-sm sm:p-8" onClick={onClose} role="dialog" aria-modal="true" aria-label={product ? "Edit project" : "Add a collaboration project"}>
        <div className="uwl-modal w-full max-w-3xl rounded-2xl border p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">{product ? `Edit ${product.name}` : "Add a collaboration project"}</h2>
              <p className="mt-1 text-sm text-gray-400">This appears on the Collaborations page with its own detail page.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-gray-500 hover:text-white">✕</button>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {text("name", "Project name", true)}
              {text("category", "Category", true, "e.g. Billing Software")}
            </div>
            {text("tagline", "Headline", true, "One strong line")}
            <div>
              <label htmlFor="p-summary" className={LABEL}>Short summary (cards) *</label>
              <textarea id="p-summary" rows={2} required maxLength={400} value={form.summary} onChange={(e) => set("summary", e.target.value)} className={FIELD} />
            </div>
            <div>
              <label htmlFor="p-description" className={LABEL}>Full description *</label>
              <textarea id="p-description" rows={4} required value={form.description} onChange={(e) => set("description", e.target.value)} className={FIELD} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {imageBox("Logo", logo, setLogo)}
              {imageBox("Main screenshot", heroImage, setHeroImage)}
            </div>

            <div>
              <span className={LABEL}>Screenshot gallery</span>
              <div className="space-y-2">
                {gallery.map((shot, i) => (
                  <div key={shot.src} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shot.src} alt="" className="h-12 w-20 rounded object-cover" />
                    <input value={shot.caption} placeholder="Caption" onChange={(e) => setGallery((g) => g.map((s, n) => (n === i ? { ...s, caption: e.target.value } : s)))} className={FIELD} />
                    <button type="button" onClick={() => setGallery((g) => g.filter((_, n) => n !== i))} className="text-xs text-red-300">Remove</button>
                  </div>
                ))}
              </div>
              <label className="mt-3 inline-block cursor-pointer rounded-lg border border-purple-400/40 px-4 py-2 text-xs text-purple-200 hover:bg-purple-600/10">
                {uploading ? "Uploading…" : "+ Add screenshots"}
                <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,image/avif" disabled={uploading} className="sr-only" onChange={(e) => void upload(picked(e), (paths) => setGallery((g) => [...g, ...paths.map((src) => ({ src, caption: "" }))]))} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {text("websiteUrl", "Website link (Visit button)", false, "https://")}
              {text("androidUrl", "Play Store link", false, "https://")}
              {text("iosUrl", "App Store link", false, "https://")}
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              {text("ctaLabel", "Button text", true)}
              <div>
                <label htmlFor="p-status" className={LABEL}>Status</label>
                <select id="p-status" value={form.status} onChange={(e) => set("status", e.target.value as ProductStatus)} className={`${FIELD} uwl-select`}>
                  <option value="live">Live</option>
                  <option value="beta">Beta</option>
                  <option value="coming-soon">Coming soon</option>
                </select>
              </div>
              <div>
                <label htmlFor="p-brand" className={LABEL}>Brand color</label>
                <input id="p-brand" type="color" value={form.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="h-11 w-full cursor-pointer rounded-lg" />
              </div>
              <div>
                <label htmlFor="p-accent" className={LABEL}>Accent color</label>
                <input id="p-accent" type="color" value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-11 w-full cursor-pointer rounded-lg" />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/4 p-4">
              <p className="mb-4 text-sm font-semibold text-white">Page sections</p>
              <p className="mb-4 text-xs text-gray-500">One item per line. Leave a section empty to hide it from the page.</p>
              <div className="space-y-4">
                {SECTIONS.map((s) => (
                  <div key={s.key}>
                    <label htmlFor={`s-${s.key}`} className={LABEL}>{s.label}</label>
                    <textarea id={`s-${s.key}`} rows={s.rows} placeholder={s.hint} value={sections[s.key]} onChange={(e) => setSections((c) => ({ ...c, [s.key]: e.target.value }))} className={`${FIELD} font-mono text-xs`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid items-center gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="p-order" className={LABEL}>Display order (lower first)</label>
                <input id="p-order" type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} className={FIELD} />
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/4 p-4">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} className="h-4 w-4 accent-purple-600" />
                <span className="text-sm text-gray-300">Show on the site</span>
              </label>
            </div>

            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={busy || uploading} className="flex-1 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {busy ? "Saving…" : product ? "Save changes" : "Add project"}
              </button>
              <button type="button" onClick={onClose} className="rounded-xl border border-white/15 px-5 py-3 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
