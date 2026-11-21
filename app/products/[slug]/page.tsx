import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  FiAlertCircle,
  FiBarChart2,
  FiBell,
  FiCloud,
  FiGrid,
  FiHeart,
  FiMessageCircle,
  FiPhoneCall,
  FiShield,
  FiSmartphone,
  FiZap,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiExternalLink,
} from "react-icons/fi";
import { Stars } from "../../components/Stars";
import { SITE_URL } from "../../data/site";
import { breadcrumbSchema, faqSchema, jsonLd, pageMeta } from "../../lib/seo";
import { findPublishedProduct } from "../../lib/server/products";
import { PRODUCT_STATUS_LABEL, type Product } from "../../lib/productTypes";
import ProductGallery from "../ProductGallery";
import ProductVisual, { ProductLogo, brandGradient } from "../ProductVisual";

export const revalidate = 60;
export const dynamicParams = true;

/** Rendered on first request, so a database hiccup can never break a build. */
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await findPublishedProduct(slug);
  if (!product) {
    return pageMeta({
      title: "Product not found",
      description: "This product is no longer available.",
      path: `/products/${slug}`,
    });
  }
  return pageMeta({
    title: `${product.name} — ${product.category}`,
    description: product.summary.slice(0, 155),
    path: `/products/${product.slug}`,
    keywords: [product.name, product.category],
    image: product.heroImage || product.logo || "/og/default.jpg",
  });
}

const FEATURE_ICONS = [FiZap, FiGrid, FiBell, FiSmartphone, FiBarChart2, FiCloud, FiMessageCircle, FiPhoneCall, FiShield, FiHeart];

const CARD =
  "rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-6";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white md:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Actions({ product }: { product: Product }) {
  const links = [
    { href: product.websiteUrl, label: product.ctaLabel },
    { href: product.androidUrl, label: "Get it on Android" },
    { href: product.iosUrl, label: "Get it on iPhone" },
  ].filter((l) => l.href);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {links.map((l, i) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            i === 0
              ? "inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-7 py-3 text-sm font-semibold text-white"
              : "inline-flex items-center justify-center gap-2 rounded-full border border-purple-500/50 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-600/10"
          }
        >
          {l.label} <FiExternalLink />
        </a>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await findPublishedProduct(slug);
  if (!product) notFound();

  const { content } = product;
  const tile = { background: brandGradient(product) };

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: product.category,
    description: product.summary,
    url: product.websiteUrl || `${SITE_URL}/products/${product.slug}`,
    ...(product.logo ? { image: `${SITE_URL}${product.logo}` } : {}),
  };

  return (
    <main className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        )}
      />
      {content.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(content.faqs))} />
      )}

      <div className="relative overflow-hidden py-14">
        <div className="absolute inset-0 bg-black" />
        <Stars />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
            <FiArrowLeft /> All products
          </Link>

          {/* Hero */}
          <header className="mt-8 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-4">
                <ProductLogo product={product} size={64} />
                <div>
                  <p className="text-xl font-bold text-white">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
              </div>
              <span className="mt-6 inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {PRODUCT_STATUS_LABEL[product.status]}
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
                {product.tagline}
              </h1>
              <p className="mt-5 leading-relaxed text-gray-400">{product.description}</p>
              <div className="mt-7">
                <Actions product={product} />
              </div>
            </div>
            <ProductVisual product={product} />
          </header>

          {content.highlights.length > 0 && (
            <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {content.highlights.map((h) => (
                <div key={h.label} className={`${CARD} text-center`}>
                  <p className="bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text text-3xl font-bold text-transparent">
                    {h.value}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">{h.label}</p>
                </div>
              ))}
            </div>
          )}

          {content.problems.length > 0 && (
            <Section eyebrow="The problem" title={`Why ${product.name} exists`}>
              <div className="grid gap-5 md:grid-cols-3">
                {content.problems.map((p) => (
                  <div key={p.title} className={CARD}>
                    <FiAlertCircle className="h-6 w-6 text-purple-400" />
                    <h3 className="mt-4 font-bold text-white">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.text}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {content.features.length > 0 && (
            <Section eyebrow="Features" title="Everything it does">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {content.features.map((f, i) => {
                  const FeatureIcon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                  return (
                  <div key={f.title} className={CARD}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={tile}>
                      <FeatureIcon style={{ color: "#ffffff" }} />
                    </span>
                    <h3 className="mt-4 font-bold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{f.text}</p>
                  </div>
                  );
                })}
              </div>
            </Section>
          )}

          {content.steps.length > 0 && (
            <Section eyebrow="How it works" title={`Get started in ${content.steps.length} steps`}>
              <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {content.steps.map((s, i) => (
                  <li key={s.title} className={CARD}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full font-bold" style={{ ...tile, color: "#ffffff" }}>
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-bold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.text}</p>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {product.gallery.length > 0 && (
            <Section eyebrow="Screenshots" title={`See ${product.name} in action`}>
              <ProductGallery shots={product.gallery} name={product.name} />
            </Section>
          )}

          {content.audience.length > 0 && (
            <Section eyebrow="Who it's for" title="Made for people like you">
              <div className="flex flex-wrap justify-center gap-3">
                {content.audience.map((a) => (
                  <span key={a} className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-gray-200">
                    <FiCheck className="text-purple-400" /> {a}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {content.plans.length > 0 && (
            <Section eyebrow="Pricing" title="Simple plans">
              <div className="grid gap-5 md:grid-cols-3">
                {content.plans.map((plan) => (
                  <div key={plan.name} className={CARD}>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="mt-2 text-2xl font-bold text-white">{plan.price}</p>
                    <p className="mt-1 text-xs text-gray-400">{plan.note}</p>
                    <ul className="mt-5 space-y-2.5">
                      {plan.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                          <FiCheck className="mt-0.5 shrink-0 text-purple-400" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {product.websiteUrl && (
                <p className="mt-5 text-center text-xs text-gray-500">
                  Current prices and plan details are on the official {product.name} website.
                </p>
              )}
            </Section>
          )}

          {content.faqs.length > 0 && (
            <Section eyebrow="FAQ" title="Common questions">
              <div className="mx-auto max-w-3xl space-y-3">
                {content.faqs.map((f) => (
                  <details key={f.question} className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-5">
                    <summary className="cursor-pointer font-semibold text-white">{f.question}</summary>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{f.answer}</p>
                  </details>
                ))}
              </div>
            </Section>
          )}

          <div className="uwl-onbrand mt-24 rounded-3xl p-8 text-center md:p-12" style={tile}>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Ready to try {product.name}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">{product.summary}</p>
            {product.websiteUrl && (
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold"
                style={{ background: "#ffffff", color: product.brandColor }}
              >
                {product.ctaLabel} <FiArrowRight />
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
