import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Is the ad spend included in the monthly fee?",
    answer:
      "No. The fee covers strategy, build, creative and management; the ad budget is paid directly to Google or Meta from your own account, so you keep ownership of the account, the data and the history.",
  },
  {
    question: "How soon will I see results?",
    answer:
      "Paid campaigns produce data in the first week and usually reach stable cost-per-enquiry in four to six weeks. SEO is slower — meaningful ranking movement typically takes three to six months depending on competition.",
  },
  {
    question: "What do you actually report each month?",
    answer:
      "Spend, enquiries, cost per enquiry, which campaigns and keywords produced them, what changed since last month and what we are doing next. Impressions and reach are context, not the headline.",
  },
  {
    question: "Can you work with our existing SEO or in-house team?",
    answer:
      "Yes. We often run paid and social alongside an in-house content team, or take the technical SEO while your team writes. We agree who owns what in the first week so nothing is duplicated.",
  },
];

export const metadata = pageMeta({
  title: "Digital Marketing Agency — Ads, SEO, Social & Content",
  description:
    "Digital marketing services: Google Ads, Meta Ads, social media, content and email campaigns managed against enquiries and revenue, with transparent monthly reporting.",
  path: "/services/digital-marketing",
  keywords: [
    "digital marketing agency",
    "google ads management services",
    "social media marketing company",
    "ppc management agency",
    "content marketing services",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function DigitalMarketingServicePage() {
  const pricing = await getServicePricing("digital-marketing");
  return (
    <>
      <ServiceSeo slug="digital-marketing" faqs={faqs} />
      <ServiceDetail
        title="Digital Marketing"
        category="Growth & Performance 📈"
        icon="fa-bullhorn"
        color="#22d3ee"
        gradient="from-cyan-500 to-sky-600"
        targetAudience={[
          "Businesses with a site but no enquiries",
          "Local service businesses",
          "E-commerce brands scaling ad spend",
          "SaaS products needing a demo pipeline",
          "Companies entering a new market",
        ]}
        features={[
          "Google Search, Display & Shopping ads",
          "Meta (Facebook & Instagram) campaigns",
          "Landing pages built for the campaign",
          "Conversion tracking & GA4 setup",
          "Keyword & audience research",
          "Ad creative: copy, images & short video",
          "Social media planning & scheduling",
          "Email and remarketing sequences",
          "Monthly reporting on cost per enquiry",
          "A/B testing on copy, creative and pages",
        ]}
        description="Ads, social, content and email campaigns run against enquiries and revenue, not impressions."
        longDescription="Marketing only counts when it produces enquiries you can put a value on, so that is what we build around. We start by fixing measurement — conversion tracking, GA4, call and form attribution — because campaigns optimised against the wrong signal burn money quietly. Then we build the campaigns: keyword and audience research, ad copy and creative, and a landing page that matches the promise in the ad instead of dumping traffic on a homepage. Every month you get a report with spend, enquiries, cost per enquiry, which campaigns produced them, and what we are changing next. Your ad accounts stay in your name, so the data and the history remain yours whether or not you keep working with us."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Measured on enquiries, not impressions",
          "Your own ad accounts, your own data",
          "Landing pages built in-house, not templated",
          "One team for ads, SEO and the website",
          "No long lock-in contract",
        ]}
        process={[
          "Audit of current traffic, tracking and spend",
          "Conversion tracking and GA4 setup",
          "Keyword, audience and competitor research",
          "Campaign build with creative and landing pages",
          "Launch, then weekly optimisation",
          "Monthly reporting and next-step plan",
        ]}
        technologies={[
          "Google Ads",
          "Meta Ads Manager",
          "Google Analytics 4",
          "Google Tag Manager",
          "Search Console",
          "Mailchimp / Brevo",
        ]}
        faqs={faqs}
      />
    </>
  );
}
