import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "What is the difference between local SEO and normal SEO?",
    answer:
      "Local SEO targets searches tied to a place — 'plumber near me', 'dentist in Manchester'. The ranking factors are different: Google Business Profile completeness, reviews, local citations, proximity and location pages matter more than general backlinks.",
  },
  {
    question: "Can you rank us in several cities or countries at once?",
    answer:
      "Yes. We build a location page per city or country with genuinely unique content, connect them with proper internal linking and hreflang, and keep each Google Business Profile consistent so the listings reinforce each other instead of competing.",
  },
  {
    question: "Do we need a physical address for local SEO?",
    answer:
      "For Google Business Profile and map pack rankings, yes — Google requires a verifiable address or a defined service area. For country-level organic rankings without maps, no address is required.",
  },
];

export const metadata = pageMeta({
  title: "Local & International SEO Services — Rank in Every Market",
  description:
    "Local SEO and multi-country SEO services: Google Business Profile optimisation, map pack rankings, city and country landing pages, citations, reviews and hreflang setup.",
  path: "/services/local-seo",
  keywords: [
    "local SEO services",
    "google business profile optimization",
    "map pack ranking services",
    "multi country SEO",
    "international SEO hreflang",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function LocalSeoServicePage() {
  const pricing = await getServicePricing("local-seo");
  return (
    <>
      <ServiceSeo slug="local-seo" faqs={faqs} />
      <ServiceDetail
        title="Local & International SEO"
        category="Location Targeting 📍"
        icon="fa-location-dot"
        color="#eab308"
        gradient="from-yellow-500 to-amber-600"
        targetAudience={[
          "Service businesses with a service area",
          "Clinics, salons, gyms & restaurants",
          "Trades, contractors & home services",
          "Multi-branch and franchise businesses",
          "Companies entering new countries",
        ]}
        features={[
          "Google Business Profile setup & optimisation",
          "Map pack (local 3-pack) ranking strategy",
          "City, region and country landing pages",
          "NAP consistency & local citation building",
          "Review generation system & responses",
          "LocalBusiness schema markup",
          "Hreflang and country targeting",
          "Local keyword research per market",
          "Competitor map-pack analysis",
          "Monthly local ranking reports",
        ]}
        description="Rank in the map pack locally and in organic results country by country."
        longDescription="Most buying searches carry a location, whether the searcher types it or Google infers it. Local SEO makes sure you appear in those results: a fully built Google Business Profile with correct categories, services, photos and posts; consistent business details across the directories Google cross-checks; a steady flow of genuine reviews; and a landing page for each place you serve with content specific to that market rather than a find-and-replace of the city name. For companies operating in several countries we add hreflang, country-targeted content and local link building so each market ranks on its own terms instead of cannibalising the others."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Appear in the Google map pack",
          "Calls and direction requests, not just clicks",
          "Works for one city or fifty",
          "Review system that keeps running",
          "Country-level targeting done properly",
        ]}
        process={[
          "Local audit & competitor map analysis",
          "Google Business Profile optimisation",
          "Citation cleanup and new listings",
          "Location pages with unique content",
          "Review generation workflow setup",
          "Monthly tracking by location",
        ]}
        technologies={[
          "Google Business Profile",
          "LocalBusiness Schema",
          "Google Search Console",
          "BrightLocal / Local Falcon",
          "GA4",
          "Hreflang / i18n routing",
        ]}
        faqs={faqs}
      />
    </>
  );
}
