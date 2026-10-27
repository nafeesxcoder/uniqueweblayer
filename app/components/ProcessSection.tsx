import Link from "next/link";
import { processSteps } from "../data/site";
import Icon from "./Icon";

/** Condensed delivery process for the home page. Full detail lives on /process. */
export default function ProcessSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.12)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
            <Icon name="fa-diagram-project" className="text-purple-400 text-sm" />
            <span className="text-sm font-medium text-purple-300">
              Our Process
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Six Steps, Every Project
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            You always know which stage the work is in and what lands next — no
            silent weeks.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {processSteps.map((s) => (
            <div
              key={s.step}
              className="group relative rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-6 hover:border-purple-500/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name={s.icon} className="text-white text-sm" />
                </div>
                <span className="text-3xl font-bold text-white/5 group-hover:text-purple-500/20 transition-colors">
                  {s.step}
                </span>
              </div>

              <h3 className="text-white font-bold">{s.title}</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {s.description}
              </p>
              <div className="mt-4 text-[11px] text-emerald-300/80">
                <Icon name="fa-box" className="text-[10px] mr-1.5" />
                {s.deliverable}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/process">
            <button className="px-8 py-3 rounded-full border border-purple-400/50 text-white text-sm font-semibold hover:bg-purple-600/10 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              See the full process
              <Icon name="fa-arrow-right" className="text-xs" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
