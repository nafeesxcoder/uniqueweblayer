import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "React Native or Flutter — which should we choose?",
    answer:
      "Flutter is the stronger choice when the app is design-heavy, animation-rich or needs identical pixel-perfect UI on both platforms. React Native fits better when your team already works in React or the app shares logic with a web product. We recommend one after seeing your requirements, not before.",
  },
  {
    question: "Does Flutter work for web and desktop too?",
    answer:
      "Yes. The same Dart codebase can target Android, iOS, web and desktop. We usually ship mobile first and add a web build when the product needs a browser version.",
  },
  {
    question: "Will the app perform like a native app?",
    answer:
      "Flutter compiles to native ARM code and renders its own UI, so animations run at 60fps and startup stays fast. We profile builds with Flutter DevTools before release.",
  },
  {
    question: "Do you handle Play Store and App Store publishing?",
    answer:
      "Yes — signing, store listings, screenshots, privacy declarations and submission, plus the review responses until the app goes live.",
  },
];

export const metadata = pageMeta({
  title: "Flutter App Development Company — Hire Flutter Developers",
  description:
    "Flutter app development company building fast, pixel-perfect Android and iOS apps from one Dart codebase. Custom UI, Firebase backend, payments and app store launch — clients worldwide.",
  path: "/services/flutter",
  keywords: [
    "flutter app development company",
    "hire flutter developers",
    "flutter development services",
    "dart app development",
    "flutter android ios app development",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function FlutterServicePage() {
  const pricing = await getServicePricing("flutter");
  return (
    <>
      <ServiceSeo slug="flutter" faqs={faqs} />
      <ServiceDetail
        title="Flutter App Development"
        category="Cross-Platform 💙"
        icon="fa-bolt"
        color="#45d1fd"
        gradient="from-blue-400 to-indigo-600"
        targetAudience={[
          "Design-led consumer apps",
          "Startups needing a fast MVP",
          "Retail, fitness & food brands",
          "Products targeting mobile + web",
          "Businesses replacing an aging app",
        ]}
        features={[
          "Single Dart codebase for Android & iOS",
          "Custom pixel-perfect UI and animations",
          "60fps performance, fast cold start",
          "Firebase auth, database & notifications",
          "Payments and subscription billing",
          "Offline caching & background sync",
          "Localisation for multiple languages",
          "Admin dashboard to manage content",
          "Automated tests & CI/CD builds",
          "Play Store & App Store release",
        ]}
        description="Fast, beautiful Flutter apps for Android and iOS from a single Dart codebase."
        longDescription="Flutter renders its own UI, which means your app looks and behaves identically on every device instead of inheriting each platform's quirks. That makes it a strong fit for brand-led products where the design has to be exact. We build the app, the Firebase or Node.js backend behind it and the admin panel your team will use daily, then handle localisation, store assets and submission. Weekly APK and TestFlight builds let you try every change on your own phone before it reaches users, and the complete repository is yours at handover."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Identical UI on Android and iOS",
          "Excellent animation performance",
          "One codebase, lower maintenance",
          "Can extend to web and desktop",
          "Full source code ownership",
        ]}
        process={[
          "Discovery, feature list and estimate",
          "UI/UX design in Figma with your approval",
          "Backend, database and API setup",
          "Flutter development in weekly sprints",
          "Device testing, profiling and QA",
          "Store launch, analytics and support",
        ]}
        technologies={[
          "Flutter / Dart",
          "Riverpod / Bloc",
          "Firebase (Auth, Firestore, FCM)",
          "Node.js / REST APIs",
          "Stripe / Razorpay",
          "GitHub Actions CI/CD",
        ]}
        faqs={faqs}
      />
    </>
  );
}
