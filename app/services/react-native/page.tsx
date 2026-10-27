import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Why React Native instead of two native apps?",
    answer:
      "One JavaScript/TypeScript codebase runs on both platforms, so you pay once for roughly 90% of the work and every future feature ships to Android and iOS together. Native modules are still available whenever a feature needs platform-specific code.",
  },
  {
    question: "Can you take over an existing React Native project?",
    answer:
      "Yes. We start with a code audit — dependency versions, build health, architecture and crash reports — then give you a short report with the fixes and a plan before writing any code.",
  },
  {
    question: "Do you use Expo or bare React Native?",
    answer:
      "Expo for most products because builds and over-the-air updates are far faster. We move to a bare workflow when the app needs custom native modules, background services or SDKs Expo doesn't support.",
  },
  {
    question: "Can we hire a React Native developer monthly?",
    answer:
      "Yes. Dedicated developers work in your time zone, join your stand-ups and work in your repository and sprint board on a monthly contract.",
  },
];

export const metadata = pageMeta({
  title: "React Native App Development Company — Hire React Native Developers",
  description:
    "React Native app development company building cross-platform Android and iOS apps from one codebase. Expo, TypeScript, push notifications, payments and store launch — worldwide delivery.",
  path: "/services/react-native",
  keywords: [
    "react native app development company",
    "hire react native developers",
    "react native development services",
    "cross platform app development react native",
    "expo app development company",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function ReactNativeServicePage() {
  const pricing = await getServicePricing("react-native");
  return (
    <>
      <ServiceSeo slug="react-native" faqs={faqs} />
      <ServiceDetail
        title="React Native App Development"
        category="Cross-Platform ⚛️"
        icon="fa-mobile-screen"
        color="#61dafb"
        gradient="from-sky-400 to-cyan-600"
        targetAudience={[
          "Startups shipping an MVP fast",
          "Web products adding a mobile app",
          "Teams already using React",
          "Marketplaces & social apps",
          "Agencies needing white-label developers",
        ]}
        features={[
          "One TypeScript codebase, both platforms",
          "Expo or bare workflow setup",
          "Native-feeling navigation & gestures",
          "Push notifications & deep links",
          "Secure auth (JWT, OAuth, biometrics)",
          "Stripe, Razorpay & in-app purchases",
          "Offline-first data with sync",
          "Over-the-air updates without store review",
          "Crash reporting & analytics",
          "CI/CD pipeline for store builds",
        ]}
        description="Native-quality Android and iOS apps from a single React Native codebase."
        longDescription="React Native lets one team ship a single codebase to Android and iOS without the compromises people associate with hybrid apps. We build with TypeScript, a typed API layer and a component library that matches your brand, so the app feels native on both platforms. Over-the-air updates mean small fixes reach users in minutes instead of waiting on store review. You get weekly builds, a documented repository and the full source at handover — plus the option to keep a dedicated React Native developer on a monthly contract after launch."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "One codebase, two app stores",
          "Faster releases with OTA updates",
          "Reuses your existing React knowledge",
          "Large ecosystem, long-term support",
          "Lower maintenance cost over time",
        ]}
        process={[
          "Product discovery & screen inventory",
          "UI/UX design and component library",
          "API and data layer architecture",
          "Sprint development with weekly builds",
          "Device QA, performance & crash testing",
          "Store release, monitoring and support",
        ]}
        technologies={[
          "React Native / Expo",
          "TypeScript",
          "Redux Toolkit / Zustand",
          "React Navigation",
          "Firebase / Supabase",
          "Node.js / Express APIs",
        ]}
        faqs={faqs}
      />
    </>
  );
}
