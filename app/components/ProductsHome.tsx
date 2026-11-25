"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import { fetchProducts } from "../lib/api";
import type { Product } from "../lib/productTypes";
import { ProductLogo, brandGradient } from "../collaborations/ProductVisual";

/** Home page block for collaborations. Hidden until at least one is published. */
export default function ProductsHome() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((list) => {
        if (!cancelled) setProducts(list.slice(0, 4));
      })
      .catch(() => {
        /* The section simply stays hidden. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
            Collaborations
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Built together
          </h2>
          <p className="mt-3 text-gray-400">
            Live projects we have built in collaboration.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40"
            >
              <div className="h-2" style={{ background: brandGradient(p) }} />
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <ProductLogo product={p} />
                  <div>
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                </div>
                <p className="mt-4 font-semibold text-white">{p.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.summary}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  {p.websiteUrl && (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-pink-700 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Visit website<span className="sr-only"> for {p.name}</span> <FiExternalLink />
                    </a>
                  )}
                  <Link
                    href={`/collaborations/${p.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400"
                  >
                    See details<span className="sr-only"> about {p.name}</span> <FiArrowRight />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/collaborations" className="text-sm font-semibold text-purple-300 hover:text-purple-200">
            View all collaborations →
          </Link>
        </div>
      </div>
    </section>
  );
}
