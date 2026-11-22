import Link from "next/link";
import type { Metadata } from "next";
import {
  FiArrowRight,
  FiCheck,
  FiExternalLink,
  FiLayers,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import { Stars } from "../components/Stars";
import { pageMeta } from "../lib/seo";
import { listProducts } from "../lib/server/products";
import { PRODUCT_STATUS_LABEL, type Product } from "../lib/productTypes";
import ProductVisual, { ProductLogo, brandGradient } from "./ProductVisual";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Collaborations — Projects Built Together | Unique Web Layer",
  description:
    "Projects Unique Web Layer has built in collaboration, including myGallaBook GST billing software and the Apnajoda dating app.",
  path: "/collaborations",
  keywords: ["Unique Web Layer collaborations", "myGallaBook", "Apnajoda"],
});

const WHY = [
  {
    icon: FiLayers,
    title: "Built together",
    text: "Every project combines the skills of the people building it, from idea to launch.",
  },
  {
    icon: FiRefreshCw,
    title: "Improved after launch",
    text: "These projects are live, so the work continues with fixes and new features.",
  },
  {
    icon: FiUsers,
    title: "Experience you can use",
    text: "What we learn on live projects goes into the work we do for clients.",
  },
];

function Showcase({ product, flip }: { product: Product; flip: boolean }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className={flip ? "lg:order-2" : ""}>
        <div className="flex items-center gap-4">
          <ProductLogo product={product} />
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {product.name}
            </h2>
            <p className="text-sm text-gray-400">{product.category}</p>
          </div>
          <span className="ml-auto rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            {PRODUCT_STATUS_LABEL[product.status]}
          </span>
        </div>

        <p className="mt-6 text-xl font-semibold text-white">{product.tagline}</p>
        <p className="mt-3 leading-relaxed text-gray-400">{product.summary}</p>

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {product.content.features.slice(0, 6).map((f) => (
            <li key={f.title} className="flex items-start gap-2 text-sm text-gray-300">
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: brandGradient(product) }}
              >
                <FiCheck className="h-2.5 w-2.5" style={{ color: "#ffffff" }} />
              </span>
              {f.title}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {product.websiteUrl && (
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Visit website <FiExternalLink />
            </a>
          )}
          <Link
            href={`/collaborations/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-500/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-600/10"
          >
            See full details <FiArrowRight />
          </Link>
        </div>
      </div>

      <div className={flip ? "lg:order-1" : ""}>
        <ProductVisual product={product} />
      </div>
    </article>
  );
}

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    products = await listProducts();
  } catch {
    products = [];
  }

  return (
    <main className="min-h-screen bg-black">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-black" />
        <Stars />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mx-auto mb-16 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              Collaborations
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl">
              Great projects are{" "}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                built together.
              </span>
            </h1>
            <p className="mt-5 leading-relaxed text-gray-400">
              Live projects Unique Web Layer has built in collaboration. Explore
              each one and visit it yourself.
            </p>
          </header>

          {products.length === 0 ? (
            <p className="py-16 text-center text-gray-400">
              Our collaborations will appear here soon.
            </p>
          ) : (
            <div className="space-y-24">
              {products.map((product, i) => (
                <Showcase key={product.id} product={product} flip={i % 2 === 1} />
              ))}
            </div>
          )}

          <div className="mt-24">
            <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
              Why we collaborate
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {WHY.map((w) => (
                <div
                  key={w.title}
                  className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-pink-600 text-white">
                    <w.icon />
                  </span>
                  <h3 className="mt-4 font-bold text-white">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{w.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="uwl-onbrand mt-20 rounded-3xl bg-linear-to-r from-purple-600 to-pink-600 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Want to build something together?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Tell us your idea and let&apos;s see how we can work on it together.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold"
              style={{ background: "#ffffff", color: "#4c1d95" }}
            >
              Start a collaboration <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
