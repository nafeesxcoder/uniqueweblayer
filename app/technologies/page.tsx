import Link from "next/link";
import Script from "next/script";
import { Stars } from "../components/Stars";
import { techStack } from "../data/site";
import { pageMeta, breadcrumbSchema, jsonLd } from "../lib/seo";
import Icon from "../components/Icon";

export const metadata = pageMeta({
  title: "Technologies — React, Next.js, React Native, Flutter, Node.js",
  description:
    "The technology stack behind our work: React, Next.js, TypeScript, React Native, Flutter, Node.js, MongoDB, PostgreSQL, AWS and the SEO tooling we use on every project.",
  path: "/technologies",
  keywords: [
    "react nextjs development company",
    "react native flutter development",
    "MERN stack technologies",
    "node.js mongodb development",
    "technology stack web development agency",
  ],
});

const whyThisStack = [
  {
    icon: "fa-bolt",
    title: "Speed by default",
    text: "Next.js server rendering and static generation mean pages load fast on slow connections — which search engines reward and users notice.",
  },
  {
    icon: "fa-arrows-rotate",
    title: "One language end to end",
    text: "JavaScript and TypeScript across the web app, the mobile app and the API keeps the team small and the code consistent.",
  },
  {
    icon: "fa-people-group",
    title: "Easy to hire for later",
    text: "React, Node and Flutter are mainstream. If you bring development in-house, developers are easy to find and onboard.",
  },
  {
    icon: "fa-lock-open",
    title: "No proprietary lock-in",
    text: "Open-source frameworks, your own cloud accounts, your own repository. Nothing in your stack depends on us staying.",
  },
];

export default function TechnologiesPage() {
  return (
    <>
      <Script
        id="tech-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Technologies", path: "/technologies" },
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
                <Icon name="fa-microchip" className="text-purple-400 text-sm" />
                <span className="text-sm font-medium text-purple-300">
                  Our Stack
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Technologies We Build With
              </h1>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                We keep the stack deliberately focused — proven, open-source and
                widely supported — so your product stays maintainable long after
                launch.
              </p>
            </div>

            {/* Stack groups */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {techStack.map((group) => (
                <div
                  key={group.group}
                  className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Icon name={group.icon} className="text-white text-sm" />
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {group.group}
                    </h2>
                  </div>

                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <Icon name="fa-check" className="text-[10px] text-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Why */}
            <div className="mt-20">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Why This Stack
              </h2>
              <div className="grid sm:grid-cols-2 gap-5 mt-10">
                {whyThisStack.map((w) => (
                  <div
                    key={w.title}
                    className="rounded-2xl border border-white/10 bg-white/3 p-6"
                  >
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600/40 to-pink-600/30 flex items-center justify-center mb-4">
                      <Icon name={w.icon} className="text-purple-200 text-sm" />
                    </div>
                    <h3 className="text-white font-semibold">{w.title}</h3>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {w.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Have a stack preference?
              </h2>
              <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
                Tell us what your team already uses. We work inside existing
                codebases as often as we start new ones.
              </p>
              <Link href="/contact">
                <button className="mt-7 px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform">
                  Talk to a Developer
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
