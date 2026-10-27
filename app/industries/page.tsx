import Link from "next/link";
import Script from "next/script";
import { Stars } from "../components/Stars";
import { industries } from "../data/site";
import { pageMeta, breadcrumbSchema, jsonLd } from "../lib/seo";
import Icon from "../components/Icon";

export const metadata = pageMeta({
  title: "Industries We Serve — Startups, E-Commerce, Real Estate & More",
  description:
    "Websites, apps and SEO built for startups and SaaS, e-commerce, real estate, healthcare, logistics, restaurants, education and professional services — in every country we work with.",
  path: "/industries",
  keywords: [
    "web development for startups",
    "ecommerce development company",
    "real estate app development",
    "healthcare website development",
    "logistics software development",
  ],
});

export default function IndustriesPage() {
  return (
    <>
      <Script
        id="industries-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
          ]),
        )}
      />

      <main className="min-h-screen bg-black">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <Stars />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
                <Icon name="fa-industry" className="text-purple-400 text-sm" />
                <span className="text-sm font-medium text-purple-300">
                  Industries
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Industries We Build For
              </h1>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Different industries fail in different places. These are the
                sectors where we already know the pitfalls — the compliance
                rules, the integrations and the pages that actually convert.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {industries.map((ind) => (
                <article
                  key={ind.name}
                  className="group rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm p-6 hover:border-purple-500/60 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name={ind.icon} className="text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {ind.name}
                  </h2>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {ind.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-20 text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Your industry not listed?
              </h2>
              <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
                That list is where we have the most repeat work, not a limit.
                Tell us about your business and we&apos;ll say honestly whether
                we are the right fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
                <Link href="/contact">
                  <button className="px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform w-full sm:w-auto">
                    Get in Touch
                  </button>
                </Link>
                <Link href="/portfolio">
                  <button className="px-7 py-3 rounded-full border border-purple-400/50 text-white text-sm font-semibold hover:bg-purple-600/10 transition-colors w-full sm:w-auto">
                    See Our Work
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
