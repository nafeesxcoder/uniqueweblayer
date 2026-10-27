import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Stars } from "../../components/Stars";
import { countries, getCountry } from "../../data/countries";
import { services } from "../../data/services";
import { SITE_URL, company } from "../../data/site";
import {
  pageMeta,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
} from "../../lib/seo";
import Icon from "../../components/Icon";

type Params = { country: string };

export function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country } = await params;
  const c = getCountry(country);

  if (!c) {
    return pageMeta({
      title: "Country not found",
      description: "This country page does not exist.",
      path: "/web-development-company",
    });
  }

  return pageMeta({
    title: `Web & App Development Company in ${c.name}`,
    description: `Unique Web Layer builds websites, Android and iOS apps and runs SEO for businesses in ${c.name}. Pricing in ${c.currency}, ${c.timezone} meeting times, local payment gateways and country-targeted search optimisation.`,
    path: `/web-development-company/${c.slug}`,
    image: `/og/${c.slug}.jpg`,
    keywords: [
      `web development company in ${c.name}`,
      `website development ${c.name}`,
      `mobile app development company ${c.name}`,
      `SEO services ${c.name}`,
      `hire web developers ${c.name}`,
      ...c.cities.slice(0, 4).map((city) => `web design company ${city}`),
    ],
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country } = await params;
  const c = getCountry(country);

  if (!c) notFound();

  const faqs = [
    {
      question: `Do you work with clients based in ${c.name}?`,
      answer: `Yes. ${c.name} is one of our regular markets. Projects run fully online — discovery calls, weekly demos and support are scheduled around ${c.timezone}, and we invoice in ${c.currency}.`,
    },
    {
      question: `Which payment gateways can you integrate for a ${c.name} business?`,
      answer: `For ${c.name} we commonly integrate ${c.payments.join(", ")}. If your business already uses a different provider, we integrate that instead — any gateway with a public API works.`,
    },
    {
      question: `Can you do SEO targeted at ${c.name} specifically?`,
      answer: `Yes. Country targeting is set up through hreflang, a ${c.name}-specific content plan, local keyword research, local link building and a Google Business Profile where you have a physical presence.`,
    },
    {
      question: `How do time zones work with a remote team?`,
      answer: c.overlap,
    },
    {
      question: `Do you build mobile apps for ${c.name} businesses too?`,
      answer: `Yes — Android and iOS apps from one React Native or Flutter codebase, published to the stores under your ${c.name} developer accounts, with local payment and language support built in.`,
    },
  ];

  const localServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Web & App Development Company in ${c.name}`,
    serviceType: "Web and Mobile App Development",
    description: `Website development, mobile app development and SEO services for businesses in ${c.name}.`,
    url: `${SITE_URL}/web-development-company/${c.slug}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "Country",
      name: c.name,
      identifier: c.code,
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}/contact`,
      availableLanguage: ["English"],
    },
  };

  const highlights = [
    {
      icon: "fa-coins",
      label: "Billing",
      value: c.currency,
      note: "Invoices and quotes in your own currency",
    },
    {
      icon: "fa-clock",
      label: "Time zone",
      value: c.timezone,
      note: c.overlap,
    },
    {
      icon: "fa-credit-card",
      label: "Payment gateways",
      value: c.payments.slice(0, 2).join(" · "),
      note: `We integrate ${c.payments.join(", ")}`,
    },
    {
      icon: "fa-magnifying-glass-location",
      label: "SEO targeting",
      value: `${c.name} search results`,
      note: "hreflang, local keywords and local link building",
    },
  ];

  const popularServices = services.filter((s) =>
    [
      "business",
      "ecommerce",
      "mobile-app",
      "react-native",
      "seo",
      "saas",
    ].includes(s.slug),
  );

  return (
    <>
      <Script
        id={`country-service-${c.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(localServiceSchema)}
      />
      <Script
        id={`country-faq-${c.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))}
      />
      <Script
        id={`country-breadcrumb-${c.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Countries", path: "/web-development-company" },
            { name: c.name, path: `/web-development-company/${c.slug}` },
          ]),
        )}
      />

      <main className="min-h-screen bg-black">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <Stars />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-purple-300">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/web-development-company"
                className="hover:text-purple-300"
              >
                Countries
              </Link>
              <span>/</span>
              <span className="text-gray-300">{c.name}</span>
            </nav>

            {/* Hero */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
                <Icon name="fa-location-dot" className="text-purple-400 text-sm" />
                <span className="text-sm font-medium text-purple-300">
                  Serving {c.name}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent leading-tight">
                Web &amp; App Development Company in {c.name}
              </h1>
              <p className="text-gray-400 mt-5 max-w-3xl mx-auto leading-relaxed">
                {company.name} builds websites, Android and iOS apps and runs
                SEO campaigns for businesses across {c.name} — from{" "}
                {c.cities.slice(0, 3).join(", ")} to the rest of the country.
                Everything is delivered online: you get a fixed quote in{" "}
                {c.currency}, weekly demos and a team that works to your
                schedule.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <Link href="/contact">
                  <button className="px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform w-full sm:w-auto">
                    Get a Quote in {c.currency.split(" ")[0]}
                  </button>
                </Link>
                <Link href="/portfolio">
                  <button className="px-7 py-3 rounded-full border border-purple-400/50 text-white text-sm font-semibold hover:bg-purple-600/10 transition-colors w-full sm:w-auto">
                    See Our Work
                  </button>
                </Link>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-5"
                >
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-wide mb-2">
                    <Icon name={h.icon} className="text-purple-400" />
                    {h.label}
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {h.value}
                  </div>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    {h.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Market note */}
            <div className="rounded-3xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-7 md:p-9 mb-16">
              <h2 className="text-2xl font-bold text-white mb-4">
                Building for the {c.name} market
              </h2>
              <p className="text-gray-400 leading-relaxed">{c.marketNote}</p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Practically, that shapes how we build: checkout flows use the
                gateways your customers already trust ({c.payments.join(", ")}),
                prices and dates render in {c.name} formats, and the SEO plan
                targets {c.name} search results rather than a generic global
                audience. Where you serve specific cities —{" "}
                {c.cities.slice(0, 4).join(", ")} — we build a page for each one
                with content written for that market.
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {c.cities.map((city) => (
                  <span
                    key={city}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/4 border border-white/10 text-gray-300"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
                Popular services in {c.name}
              </h2>
              <p className="text-gray-400 text-sm text-center mb-10 max-w-2xl mx-auto">
                The services {c.demonym} clients request most. The full
                catalogue is on the services page.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group rounded-2xl border border-white/10 bg-white/3 p-5 hover:border-purple-500/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${s.gradient} flex items-center justify-center mb-3`}
                    >
                      <Icon name={s.icon} className="text-white text-sm" />
                    </div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                      {s.description}
                    </p>
                    <div className="text-xs text-purple-400 mt-3">
                      From {s.price}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
                {c.name} — common questions
              </h2>
              <div className="space-y-3 max-w-3xl mx-auto">
                {faqs.map((f, idx) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-white/10 bg-linear-to-br from-purple-900/15 to-black/40 p-5 open:border-purple-500/40 transition-colors"
                  >
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-white font-medium text-sm">
                      {f.question}
                      <Icon name="fa-chevron-down" className="text-purple-400 text-xs mt-1 shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Start your project in {c.name}
              </h2>
              <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
                Send the requirements and get a fixed quote in {c.currency},
                with a timeline that accounts for your working hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
                <Link href="/contact">
                  <button className="px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform w-full sm:w-auto">
                    Get a Free Quote
                  </button>
                </Link>
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-7 py-3 rounded-full border border-green-500/40 text-white text-sm font-semibold hover:bg-green-600/10 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                    <Icon name="fa-whatsapp" className="text-green-400" />
                    WhatsApp Us
                  </button>
                </a>
              </div>
            </div>

            {/* Other countries */}
            <div className="mt-16">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 text-center">
                We also work in
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {countries
                  .filter((x) => x.slug !== c.slug)
                  .map((x) => (
                    <Link
                      key={x.slug}
                      href={`/web-development-company/${x.slug}`}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/3 border border-white/10 text-gray-400 hover:text-purple-300 hover:border-purple-500/40 transition-colors"
                    >
                      {x.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
