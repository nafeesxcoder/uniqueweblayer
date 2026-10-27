import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Do you build for both Android and iOS?",
    answer:
      "Yes. We build one cross-platform codebase in React Native or Flutter that ships to both the Google Play Store and the Apple App Store, which keeps cost and maintenance close to half of two native builds.",
  },
  {
    question: "Do you publish the app to the stores for us?",
    answer:
      "Yes. We prepare store listings, screenshots, privacy policy, signing keys and builds, then submit on your developer accounts and handle review feedback until the app is approved.",
  },
  {
    question: "Can you build an app for my existing website?",
    answer:
      "Yes. If your site already has an API we connect to it; if it doesn't, we build the backend alongside the app so the website and app share one database and one admin panel.",
  },
  {
    question: "Which countries do you work with?",
    answer:
      "All of them. App projects are delivered fully online — requirements calls, weekly demo builds via TestFlight and Firebase App Distribution, and support in your time zone.",
  },
];

export const metadata = pageMeta({
  title: "Mobile App Development Company — Android & iOS Apps",
  description:
    "Mobile app development company building Android and iOS apps from one codebase. React Native and Flutter apps with backend, admin panel and app store launch — for clients worldwide.",
  path: "/services/mobile-app",
  keywords: [
    "mobile app development company",
    "android and ios app development",
    "cross platform app development",
    "hire mobile app developers",
    "app development services worldwide",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function MobileAppServicePage() {
  const pricing = await getServicePricing("mobile-app");
  return (
    <>
      <ServiceSeo slug="mobile-app" faqs={faqs} />
      <ServiceDetail
        title="Mobile App Development"
        category="Android & iOS 📱"
        icon="fa-mobile-screen-button"
        color="#22d3ee"
        gradient="from-cyan-500 to-blue-600"
        targetAudience={[
          "Startups launching an MVP",
          "Businesses going mobile-first",
          "Marketplaces & delivery services",
          "Gyms, clinics & booking businesses",
          "Agencies needing a white-label dev team",
        ]}
        features={[
          "Single codebase for Android + iOS",
          "Custom UI/UX design for every screen",
          "User authentication & profiles",
          "Push notifications (Firebase / OneSignal)",
          "In-app payments & subscriptions",
          "Offline mode & local storage",
          "Maps, chat, camera & device APIs",
          "Admin panel to manage app content",
          "Analytics & crash reporting",
          "Play Store & App Store submission",
        ]}
        description="Android and iOS apps built from one codebase, designed, shipped and published for you."
        longDescription="We build mobile apps end to end: product discovery, UI/UX design, cross-platform development in React Native or Flutter, the backend and admin panel behind it, store submission and post-launch updates. You get weekly test builds on your own device, a staging API you can inspect, and the full source code at handover. Whether it is a marketplace, a booking app, a delivery product or a companion app for your existing website, the result ships to both stores from a single codebase — so new features go live on Android and iOS at the same time."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Half the cost of two native builds",
          "One team for app, backend and website",
          "Weekly test builds you can install",
          "Store launch handled for you",
          "Full source code ownership",
        ]}
        process={[
          "Requirements workshop & feature list",
          "Wireframes and UI/UX design approval",
          "Backend, API and database setup",
          "Cross-platform app development in sprints",
          "QA on real Android and iOS devices",
          "Store submission, launch and support",
        ]}
        technologies={[
          "React Native / Expo",
          "Flutter / Dart",
          "Node.js / Express",
          "Firebase / Supabase",
          "MongoDB / PostgreSQL",
          "Stripe / Razorpay / In-App Purchases",
        ]}
        faqs={faqs}
      />
    </>
  );
}
