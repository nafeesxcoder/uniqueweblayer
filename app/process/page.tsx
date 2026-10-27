import Link from "next/link";
import Script from "next/script";
import { Stars } from "../components/Stars";
import { processSteps, engagementModels } from "../data/site";
import { pageMeta, breadcrumbSchema, jsonLd } from "../lib/seo";
import { SITE_URL } from "../data/site";
import Icon from "../components/Icon";

export const metadata = pageMeta({
  title: "Our Process — How We Design, Build and Launch",
  description:
    "The six-step delivery process behind every Unique Web Layer project: discovery, UI/UX design, sprint development, QA, launch with SEO setup, and ongoing support. Transparent timelines and weekly demos.",
  path: "/process",
  keywords: [
    "web development process",
    "software development process steps",
    "app development workflow",
    "agile web design process",
  ],
});

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How Unique Web Layer delivers a web or app project",
  description:
    "The six stages every website, mobile app and software project goes through at Unique Web Layer.",
  url: `${SITE_URL}/process`,
  step: processSteps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.description,
  })),
};

const standards = [
  {
    icon: "fa-gauge-high",
    title: "Performance budget",
    text: "Every build targets 90+ Lighthouse performance with optimised images, code splitting and caching.",
  },
  {
    icon: "fa-mobile-screen",
    title: "Mobile-first",
    text: "Designed at phone width first, then scaled up — because most of your traffic arrives on a phone.",
  },
  {
    icon: "fa-universal-access",
    title: "Accessibility basics",
    text: "Semantic HTML, keyboard navigation, colour contrast and alt text on every image as standard.",
  },
  {
    icon: "fa-shield-halved",
    title: "Security",
    text: "HTTPS, input validation, rate limiting, secure auth and dependency scanning before launch.",
  },
  {
    icon: "fa-magnifying-glass",
    title: "SEO foundation",
    text: "Clean URLs, metadata, schema markup, sitemap and Search Console connected at launch.",
  },
  {
    icon: "fa-box-archive",
    title: "Clean handover",
    text: "Repository access, environment docs, credentials and a walkthrough recording at the end.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <Script
        id="process-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(howToSchema)}
      />
      <Script
        id="process-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Process", path: "/process" },
          ]),
        )}
      />

      <main className="min-h-screen bg-black">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <Stars />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
                <Icon name="fa-diagram-project" className="text-purple-400 text-sm" />
                <span className="text-sm font-medium text-purple-300">
                  How We Work
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
                From First Call to Launch
              </h1>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                The same six stages run on every project, whether it is a
                landing page or a multi-country platform. You always know which
                stage you are in and what arrives next.
              </p>
            </div>

            {/* Steps */}
            <div className="relative">
              <div className="absolute left-[27px] top-4 bottom-4 w-px bg-linear-to-b from-purple-500/60 via-purple-500/20 to-transparent hidden sm:block" />

              <div className="space-y-6">
                {processSteps.map((s) => (
                  <div key={s.step} className="relative flex gap-5">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/40 z-10">
                      <Icon name={s.icon} className="text-white" />
                    </div>

                    <div className="flex-1 rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 transition-colors">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-purple-400">
                          STEP {s.step}
                        </span>
                        <h2 className="text-xl font-bold text-white">
                          {s.title}
                        </h2>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {s.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200/90">
                        <Icon name="fa-box" className="text-[10px]" />
                        You receive: {s.deliverable}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standards */}
            <div className="mt-20">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Standards On Every Build
              </h2>
              <p className="text-gray-400 text-sm text-center mt-3 max-w-2xl mx-auto">
                These are included in the price, not sold as add-ons.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                {standards.map((s) => (
                  <div
                    key={s.title}
                    className="rounded-2xl border border-white/10 bg-white/3 p-6 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600/40 to-pink-600/30 flex items-center justify-center mb-4">
                      <Icon name={s.icon} className="text-purple-200 text-sm" />
                    </div>
                    <h3 className="text-white font-semibold">{s.title}</h3>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement */}
            <div className="mt-20">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Engagement Models
              </h2>
              <div className="grid md:grid-cols-3 gap-5 mt-10">
                {engagementModels.map((m) => (
                  <div
                    key={m.title}
                    className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-6"
                  >
                    <Icon name={m.icon} className="text-purple-400 text-xl mb-4 block" />
                    <h3 className="text-white font-bold">{m.title}</h3>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-20 text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Start with step one
              </h2>
              <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
                A short discovery call, then a written scope and fixed quote —
                usually back with you within one working day.
              </p>
              <Link href="/contact">
                <button className="mt-7 px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform">
                  Book a Discovery Call
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
