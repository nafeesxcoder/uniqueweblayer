import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "How many pages does a business website include?",
    answer:
      "The standard build is 5–10 pages: home, about, services (one page per service when it helps with SEO), contact, and supporting pages like pricing or FAQs. Extra pages are quoted per page, and the structure is agreed in the scope document before work starts.",
  },
  {
    question: "Will the site bring enquiries, not just look good?",
    answer:
      "That is what the structure is built around: a clear offer above the fold, proof and credibility sections, service pages that match what people actually search for, and contact forms that land in your inbox within seconds. We also set up Search Console and analytics so you can see where enquiries come from.",
  },
  {
    question: "Can I update the content myself afterwards?",
    answer:
      "Yes. We can connect a CMS so you edit text and images from a dashboard with no code, or hand over the site and document how to edit content directly. Tell us which you prefer during discovery — it changes the build slightly.",
  },
  {
    question: "Do you work with businesses outside India?",
    answer:
      "Most of our clients are outside India — the US, UK, Canada, Australia and the UAE. Everything is delivered online, quotes are in your currency and calls are scheduled in your time zone.",
  },
];

export const metadata = pageMeta({
  title: "Business Website Development Company — Corporate Websites",
  description: "Business and corporate website development for companies worldwide. Fast, mobile-first sites with service pages, lead forms and SEO built in. Fixed quotes, worldwide delivery.",
  path: "/services/business",
  keywords: ["business website development", "corporate website design company", "company website developer", "small business website design"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function BusinessServicePage() {
  const pricing = await getServicePricing("business");
  return (
    <>
      <ServiceSeo slug="business" faqs={faqs} />
      <ServiceDetail
      title="Business / Company Website"
      category="For Local Businesses & Startups"
      icon="fa-building"
      color="#06b6d4"
      gradient="from-cyan-500 to-blue-600"
      targetAudience={[
        "Local Businesses & Shops",
        "Small to Medium Enterprises (SMEs)",
        "Startups & Agencies",
        "Corporate Companies",
      ]}
      features={[
        "Professional Home Page with Hero Section",
        "About Us / Company Profile Page",
        "Services / Products Showcase",
        "Contact Form with Google Maps",
        "SEO Optimized Structure",
        "Mobile Responsive Design",
        "Fast Loading Speed",
        "Admin Panel for Easy Updates",
      ]}
      description="Establish your online presence and attract more customers globally"
      longDescription="A professional business website is the digital face of your company. It establishes credibility, showcases your services, and helps potential customers find you online. We build modern, fast, SEO-friendly business websites that convert visitors into leads — for clients in every country."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "24/7 Online Presence",
        "Increased Brand Credibility",
        "More Customer Leads",
        "Better Search Engine Ranking",
      ]}
      process={[
        "Requirement Gathering & Business Analysis",
        "Design Mockups & Client Revisions",
        "Development & Content Integration",
        "Testing & Quality Assurance",
        "Launch & Deployment",
      ]}
      technologies={[
        "React.js / Next.js",
        "Tailwind CSS",
        "Node.js / Express",
        "MongoDB / PostgreSQL",
      ]}
        faqs={faqs}
      />
    </>
  );
}
