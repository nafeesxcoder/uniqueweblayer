import Link from "next/link";
import Script from "next/script";
import { Stars } from "../components/Stars";
import faqData from "../data/faq.json";
import { company } from "../data/site";
import {
  pageMeta,
  faqSchema,
  breadcrumbSchema,
  jsonLd,
} from "../lib/seo";
import Icon from "../components/Icon";

export const metadata = pageMeta({
  title: "FAQ — Pricing, Timelines, Ownership & How We Work",
  description:
    "Answers to the questions clients ask most: what we build, what it costs, how long projects take, which countries we serve, who owns the code and how support works after launch.",
  path: "/faq",
  keywords: [
    "web development company FAQ",
    "website development cost",
    "app development timeline",
    "web agency questions",
  ],
});

export default function FaqPage() {
  const faqs = faqData.faqs;

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))}
      />
      <Script
        id="faq-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        )}
      />

      <main className="min-h-screen bg-black">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <Stars />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
                <Icon name="fa-circle-question" className="text-purple-400 text-sm" />
                <span className="text-sm font-medium text-purple-300">
                  Questions
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Pricing, timelines, ownership, support and how working with a
                remote team actually goes day to day.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-linear-to-br from-purple-900/15 to-black/40 p-5 open:border-purple-500/40 transition-colors"
                  {...(idx === 0 ? { open: true } : {})}
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-white font-semibold">
                    <span>{faq.question}</span>
                    <Icon name="fa-chevron-down" className="text-purple-400 text-xs mt-1.5 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-16 text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Still have a question?
              </h2>
              <p className="text-gray-400 mt-3 text-sm md:text-base">
                Email{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-purple-300 hover:text-purple-200"
                >
                  {company.email}
                </a>{" "}
                or message us on WhatsApp — replies usually within six hours,
                any time zone.
              </p>
              <Link href="/contact">
                <button className="mt-7 px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
