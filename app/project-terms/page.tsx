import Link from "next/link";
import type { Metadata } from "next";
import { FiDownload } from "react-icons/fi";
import { Stars } from "../components/Stars";
import { pageMeta } from "../lib/seo";
import { getTerms } from "../lib/server/terms";

export const metadata: Metadata = pageMeta({
  title: "Project Terms, Payment and Hosting",
  description:
    "How Unique Web Layer projects are paid for, run, hosted and renewed: payment stages, hosting included for the first year, yearly renewal and refunds.",
  path: "/project-terms",
});

export const revalidate = 60;

export default async function ProjectTermsPage() {
  const terms = await getTerms();
  return (
    <main className="min-h-screen bg-black">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-black" />
        <Stars />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              Project Terms
            </span>
            <h1 className="mt-5 text-4xl font-bold text-white md:text-5xl">
              Payment, hosting and how we work
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Last updated {terms.updated}. {terms.notice}
            </p>
            <Link
              href="/project-terms/pdf"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white"
            >
              <FiDownload /> Download as PDF
            </Link>
          </header>

          <div className="mt-14 rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-7 md:p-10">
            <h2 className="text-xl font-bold text-white">Payment at each stage</h2>
            <p className="mt-2 text-sm text-gray-400">
              For projects above {terms.largeThreshold}. Smaller projects pay {terms.smallSplit.toLowerCase()}.
            </p>
            <ol className="mt-7 grid gap-5 md:grid-cols-3">
              {terms.stages.map((stage) => (
                <li key={stage.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-bold text-white">{stage.percent}%</p>
                  <p className="mt-1 text-sm font-semibold text-purple-300">{stage.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{stage.gets}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 space-y-6">
            {terms.sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-6 md:p-8">
                <h2 className="text-lg font-bold text-white">{section.title.replace(/^\d+\.\s*/, "")}</h2>
                <ul className="mt-4 space-y-3">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-gray-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Questions about your project? <Link href="/contact" className="text-purple-300 hover:text-purple-200">Contact us</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
