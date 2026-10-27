import Link from "next/link";
import Script from "next/script";
import { Stars } from "../components/Stars";
import { countries, serviceRegions } from "../data/countries";
import { SITE_URL } from "../data/site";
import { pageMeta, breadcrumbSchema, jsonLd } from "../lib/seo";
import Icon from "../components/Icon";

export const metadata = pageMeta({
  title: "Web & App Development Company — Serving Clients in Every Country",
  description:
    "Unique Web Layer works with businesses worldwide. Pick your country to see how we deliver websites, mobile apps and SEO there — local currencies, payment gateways, time zones and search targeting.",
  path: "/web-development-company",
  keywords: [
    "web development company worldwide",
    "offshore web development company",
    "international app development company",
    "global SEO agency",
    "hire developers from any country",
  ],
});

const countryListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Countries served by Unique Web Layer",
  itemListElement: countries.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `Web & App Development Company in ${c.name}`,
    url: `${SITE_URL}/web-development-company/${c.slug}`,
  })),
};

export default function CountriesIndexPage() {
  return (
    <>
      <Script
        id="countries-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(countryListSchema)}
      />
      <Script
        id="countries-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Countries We Serve", path: "/web-development-company" },
          ]),
        )}
      />

      <main className="min-h-screen bg-black">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <Stars />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
                <Icon
                  name="fa-earth-americas"
                  className="text-purple-400 text-sm"
                />
                <span className="text-sm font-medium text-purple-300">
                  Worldwide Delivery
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
                A Development Company for Every Country
              </h1>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Everything we do is delivered online, so where you are changes
                the currency, the payment gateway and the meeting time — not the
                quality of the build. Pick your country below.
              </p>
            </div>

            {/* Regions */}
            <div className="flex flex-wrap justify-center gap-2 mb-14">
              {serviceRegions.map((r) => (
                <span
                  key={r}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/4 border border-white/10 text-gray-300"
                >
                  {r}
                </span>
              ))}
            </div>

            {/* Country grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((c) => (
                <Link
                  key={c.slug}
                  href={`/web-development-company/${c.slug}`}
                  className="group rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-5 hover:border-purple-500/60 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-white font-bold group-hover:text-purple-300 transition-colors">
                      {c.name}
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                      {c.code}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Icon name="fa-coins" className="text-purple-400 w-3.5" />
                      {c.currency}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="fa-clock" className="text-purple-400 w-3.5" />
                      {c.timezone}
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon
                        name="fa-location-dot"
                        className="text-purple-400 w-3.5 mt-0.5"
                      />
                      <span className="line-clamp-1">
                        {c.cities.slice(0, 3).join(", ")}
                      </span>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-purple-400 group-hover:gap-3 transition-all">
                    View {c.name} page
                    <Icon name="fa-arrow-right" className="text-[10px]" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Country not listed?
              </h2>
              <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
                These are simply the markets we work in most. We take projects
                from anywhere — send your requirements and we&apos;ll quote in
                your currency.
              </p>
              <Link href="/contact">
                <button className="mt-7 px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform">
                  Get a Free Quote
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
