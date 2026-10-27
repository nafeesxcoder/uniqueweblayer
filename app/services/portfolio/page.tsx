import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "What should a portfolio website contain?",
    answer:
      "Your best 6–12 projects with a short case study each (the problem, what you made, the outcome), an about page that establishes credibility, clear contact details, and a CV or services page depending on whether you want jobs or clients. Fewer strong projects beat a long list of weak ones.",
  },
  {
    question: "Can clients or recruiters see it on mobile properly?",
    answer:
      "Yes — it is designed at phone width first, because most people open a portfolio link on their phone. Images are optimised so project shots load quickly on mobile data.",
  },
  {
    question: "Can I add new projects myself?",
    answer:
      "Yes. Projects live in a single structured file or a CMS, so adding one means filling in the fields — title, description, images, link, tags — without touching layout code.",
  },
  {
    question: "Will it be found on Google?",
    answer:
      "We set up the technical basics: clean URLs, metadata, schema, sitemap and Search Console. For a personal portfolio, ranking for your own name is realistic quickly; ranking for competitive terms like 'freelance designer London' takes content and links over time.",
  },
];

export const metadata = pageMeta({
  title: "Portfolio Website Design & Development",
  description: "Portfolio website design for creatives, studios, consultants and professionals. Case-study layouts, fast loading and SEO-ready — built for clients worldwide.",
  path: "/services/portfolio",
  keywords: ["portfolio website design", "personal portfolio website developer", "creative portfolio website company"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function PortfolioServicePage() {
  const pricing = await getServicePricing("portfolio");
  return (
    <>
      <ServiceSeo slug="portfolio" faqs={faqs} />
      <ServiceDetail
      title="Portfolio Website"
      category="For Developers & Creatives 🎨"
      icon="fa-user-astronaut"
      color="#8b5cf6"
      gradient="from-purple-600 to-indigo-600"
      targetAudience={[
        "Freelance Developers",
        "UI/UX Designers",
        "Photographers & Artists",
        "Creative Professionals",
      ]}
      features={[
        "Projects & Work Showcase",
        "Skills & Expertise Section",
        "About Me / Bio",
        "Contact Form",
        "Testimonials Section",
        "Resume/CV Download",
      ]}
      description="Showcase your work professionally and attract global clients"
      longDescription="A portfolio website is your digital resume. We create modern portfolio websites that put your best projects and skills in front of the right people."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Stand Out from Competition",
        "Attract High-Quality Clients",
        "Build Personal Brand",
      ]}
      process={[
        "Content & Project Collection",
        "Design Concept Creation",
        "Development & Animation",
        "Launch & Promotion",
      ]}
      technologies={[
        "Next.js / React",
        "Tailwind CSS",
        "Framer Motion",
        "Vercel Deployment",
      ]}
        faqs={faqs}
      />
    </>
  );
}
