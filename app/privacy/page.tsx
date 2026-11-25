import Link from "next/link";
import type { Metadata } from "next";
import { Stars } from "../components/Stars";
import { pageMeta } from "../lib/seo";
import { company } from "../data/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What information Unique Web Layer collects through its website and contact forms, how it is used, and how to ask us to delete it.",
  path: "/privacy",
});

const UPDATED = "24 November 2026";

const sections: { title: string; points: string[] }[] = [
  {
    title: "Information you give us",
    points: [
      "When you send an enquiry, we collect your name, email address, phone number, the service you are interested in, your budget range (if you choose to give it) and your message.",
      "When you apply to become a partner or request a callback, we collect the details you type into that form.",
      "We do not ask for payment card details on this website.",
    ],
  },
  {
    title: "Information collected automatically",
    points: [
      "We use Google Analytics to understand which pages are visited and how people find the site. It records anonymous usage data such as pages viewed, device type and approximate location.",
      "The site stores small pieces of information in your browser: your chosen theme (light or dark) and the page where your visit started, so we know which page brought an enquiry. This stays on your device.",
    ],
  },
  {
    title: "How we use it",
    points: [
      "To reply to your enquiry, prepare a quote, and deliver the project you ask for.",
      "To improve the website and understand which services are of interest.",
      "We do not sell your personal information, and we do not use it for advertising.",
    ],
  },
  {
    title: "Who else sees it",
    points: [
      "Our team, and the service providers that run the website, host our email and store our data, only for the purposes above.",
      "We may share information when the law requires it.",
    ],
  },
  {
    title: "How long we keep it",
    points: [
      "Enquiry details are kept while a project or conversation is open, and for up to 2 years afterwards for our records, unless you ask us to delete them sooner.",
    ],
  },
  {
    title: "Your choices",
    points: [
      "You can ask us to see, correct or delete the personal information we hold about you.",
      "You can block cookies or clear local storage in your browser. The site will still work.",
    ],
  },
  {
    title: "Security",
    points: [
      "We take reasonable steps to protect your information, including encrypted (HTTPS) connections and restricted access to our admin area.",
    ],
  },
  {
    title: "Children",
    points: [
      "Our services are for businesses and adults. We do not knowingly collect information from children under 13.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-black" />
        <Stars />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-400">Last updated: {UPDATED}</p>
          <p className="mt-6 leading-relaxed text-gray-300">
            This policy explains what information {company.name} collects when you use uniqueweblayer.com
            and our apps, how we use it, and your choices. Questions? Email{" "}
            <a href={`mailto:${company.email}`} className="text-purple-300 hover:text-purple-200">
              {company.email}
            </a>
            .
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-xl font-semibold text-white">{s.title}</h2>
                <ul className="mt-3 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3 leading-relaxed text-gray-300">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-12 text-sm text-gray-500">
            See also our{" "}
            <Link href="/project-terms" className="text-purple-300 hover:text-purple-200">
              project terms
            </Link>{" "}
            for payment and hosting details.
          </p>
        </div>
      </section>
    </main>
  );
}
