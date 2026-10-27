import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "What makes a landing page convert better than a homepage?",
    answer:
      "A homepage serves everyone, so it asks visitors to choose. A landing page has one audience, one promise and one action — no navigation to wander off into. Ad traffic in particular converts far better when the page matches the ad it came from.",
  },
  {
    question: "Can you build several versions for A/B testing?",
    answer:
      "Yes. We build variants that share components so only the tested element changes, and wire them to your testing tool or to a simple split at the routing level. Each extra variant is quoted separately.",
  },
  {
    question: "Will it work with Google Ads and Meta Ads tracking?",
    answer:
      "Yes — conversion pixels, Google Ads tags, Meta Pixel, GA4 events and server-side events where you need them. We test that conversions actually register before launch, which is where most pages fail.",
  },
  {
    question: "How fast can a landing page go live?",
    answer:
      "One to two weeks from approved copy. If you already have the copy and brand assets, it can be shorter — tell us the campaign date and we will tell you honestly whether it is possible.",
  },
];

export const metadata = pageMeta({
  title: "Landing Page Design & Development — High-Converting Pages",
  description: "High-converting landing page design and development for ad campaigns, product launches and lead generation. Fast builds, A/B ready, delivered worldwide.",
  path: "/services/landing",
  keywords: ["landing page design service", "high converting landing page development", "ppc landing page designer", "product launch page"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function LandingPageServicePage() {
  const pricing = await getServicePricing("landing");
  return (
    <>
      <ServiceSeo slug="landing" faqs={faqs} />
      <ServiceDetail
      title="Landing Page"
      category="Marketing Focused Site 🎯"
      icon="fa-bullseye"
      color="#f59e0b"
      gradient="from-orange-500 to-red-600"
      targetAudience={[
        "Ad Campaigns",
        "Product Launches",
        "Event Promotions",
        "Lead Generation",
      ]}
      features={[
        "Single Page Design",
        "Attention-Grabbing Hero Section",
        "Clear CTA Buttons",
        "Lead Capture Forms",
        "Analytics Integration",
        "Fast Loading Speed",
      ]}
      description="Convert visitors into paying customers with high-performing landing pages"
      longDescription="A landing page is designed with one goal in mind - conversion. We create high-converting landing pages that turn paid traffic into customers, built to be A/B tested from day one."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Higher Conversion Rates",
        "Better ROI on Ads",
        "Fast Loading Speed",
      ]}
      process={[
        "Goal Definition",
        "Design & Development",
        "Testing & Optimization",
        "Launch & Analytics Setup",
      ]}
      technologies={[
        "React / HTML/CSS",
        "Tailwind CSS",
        "JavaScript",
        "Google Analytics",
      ]}
        faqs={faqs}
      />
    </>
  );
}
