import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "How long before we see ranking results?",
    answer:
      "Technical fixes and on-page work usually show movement in 4–8 weeks. Competitive keywords in large markets typically take 4–6 months of consistent content and link building. We report progress monthly so you can see the trend, not just the final position.",
  },
  {
    question: "Do you do SEO for countries outside India?",
    answer:
      "Yes — most of our SEO clients are in the US, UK, Canada, Australia and the UAE. International SEO means hreflang setup, country-targeted content, local link building and currency/language handling, all of which we implement.",
  },
  {
    question: "Can you do SEO on a website you didn't build?",
    answer:
      "Yes. We start with a full technical audit of your existing site — crawlability, speed, schema, content gaps and backlinks — and give you a prioritised fix list before any retainer starts.",
  },
  {
    question: "Do you guarantee a number one ranking?",
    answer:
      "No one credible can guarantee a specific position, because search engines control the results. What we commit to is the work: technical fixes, content, schema, speed and links, with monthly reporting on rankings, traffic and conversions.",
  },
];

export const metadata = pageMeta({
  title: "SEO Services Company — Technical, On-Page & International SEO",
  description:
    "SEO services for businesses worldwide: technical SEO audits, on-page optimisation, schema markup, Core Web Vitals, content and international SEO with hreflang. Monthly reporting on rankings and traffic.",
  path: "/services/seo",
  keywords: [
    "SEO services company",
    "international SEO agency",
    "technical SEO services",
    "on page SEO services",
    "SEO for ecommerce websites",
    "hire SEO experts",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function SeoServicePage() {
  const pricing = await getServicePricing("seo");
  return (
    <>
      <ServiceSeo slug="seo" faqs={faqs} />
      <ServiceDetail
        title="SEO Services"
        category="Search & Growth 📈"
        icon="fa-magnifying-glass-chart"
        color="#84cc16"
        gradient="from-lime-500 to-green-600"
        targetAudience={[
          "Businesses invisible on Google",
          "E-commerce stores losing to competitors",
          "SaaS products needing organic signups",
          "Local service businesses",
          "Companies expanding into new countries",
        ]}
        features={[
          "Full technical SEO audit",
          "Keyword research & search intent mapping",
          "On-page optimisation (titles, headings, content)",
          "Schema / JSON-LD structured data",
          "Core Web Vitals & page speed fixes",
          "Internal linking architecture",
          "International SEO with hreflang",
          "Google Business Profile optimisation",
          "Content plan & SEO copywriting",
          "Monthly ranking, traffic & conversion reports",
        ]}
        description="Technical, on-page and international SEO that moves pages onto page one and keeps them there."
        longDescription="SEO work only pays off when the technical base, the content and the authority signals all line up. We start with an audit of what is holding the site back — crawl errors, slow pages, thin or duplicated content, missing schema, broken internal links — and fix those first because they are the cheapest wins. Then we build the keyword map around what your customers actually search for in each country, rewrite and expand the pages that matter, add structured data so Google can show rich results, and run a monthly content and link programme. Every month you get a report with rankings, organic traffic, impressions and enquiries, plus what we're doing next — no vanity metrics."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Traffic that doesn't stop when ads stop",
          "Fixes that also improve conversions",
          "Country-level targeting, not guesswork",
          "Clear monthly reporting",
          "Works on any platform or CMS",
        ]}
        process={[
          "Technical audit & competitor analysis",
          "Keyword research and page mapping",
          "On-page and technical fixes",
          "Schema markup and speed optimisation",
          "Content production and link building",
          "Monthly reporting and iteration",
        ]}
        technologies={[
          "Google Search Console",
          "GA4 / Looker Studio",
          "Ahrefs / SEMrush",
          "Screaming Frog",
          "Schema.org / JSON-LD",
          "PageSpeed Insights / Lighthouse",
        ]}
        faqs={faqs}
      />
    </>
  );
}
