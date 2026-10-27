import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Do you handle subscriptions and billing?",
    answer:
      "Yes — plans, trials, upgrades and downgrades, proration, failed-payment retries, invoices and VAT or GST handling through Stripe, Paddle or LemonSqueezy. Paddle and LemonSqueezy also act as merchant of record, which removes a lot of international tax work.",
  },
  {
    question: "Can the app support multiple teams or organisations?",
    answer:
      "Yes. Multi-tenant architecture with workspaces, team invitations and role-based permissions is a standard part of the build when you need it.",
  },
  {
    question: "Will it scale when we get thousands of users?",
    answer:
      "The architecture is built for it: stateless services, database indexing and connection pooling, caching, background job queues and CDN delivery. We also set up monitoring so you see pressure before users feel it.",
  },
  {
    question: "Can you take over a half-built SaaS product?",
    answer:
      "Yes. We start with a code and architecture audit, give you a written assessment of what is solid and what needs replacing, and only then quote the work. No rewrite gets recommended without a reason you can read.",
  },
];

export const metadata = pageMeta({
  title: "SaaS Development Company — Web App & Platform Development",
  description: "SaaS and web application development: authentication, subscriptions, dashboards, APIs and scalable architecture. SaaS platforms built for founders worldwide.",
  path: "/services/saas",
  keywords: ["SaaS development company", "web application development company", "saas platform development", "custom dashboard development"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function SaaSservicePage() {
  const pricing = await getServicePricing("saas");
  return (
    <>
      <ServiceSeo slug="saas" faqs={faqs} />
      <ServiceDetail
      title="SaaS / Web App"
      category="Premium Level (High Price) 💎"
      icon="fa-cloud"
      color="#a855f7"
      gradient="from-purple-500 to-pink-600"
      targetAudience={[
        "Startups & Entrepreneurs",
        "Tech Companies",
        "Software Providers",
        "B2B Businesses",
        "Innovation Labs",
      ]}
      features={[
        "User Authentication (Login/Signup)",
        "User Dashboard",
        "Subscription Plans",
        "Payment Integration",
        "API Integrations",
        "Data Visualization",
        "Admin Panel",
        "Email Notifications",
        "Analytics Dashboard",
        "Scalable Architecture",
      ]}
      description="Build scalable web applications with secure backend systems"
      longDescription="Turn your software idea into reality with a professional SaaS web application. We build scalable, secure web apps that handle thousands of users. From user authentication to payment processing and data analytics, your SaaS platform will be enterprise-ready and built for growth."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Scalable Architecture",
        "Recurring Revenue Model",
        "Enterprise Ready",
        "Secure & Reliable",
        "User Analytics",
      ]}
      process={[
        "Product Requirements Planning",
        "Architecture Design",
        "Development & API Integration",
        "Subscription Setup",
        "Security Testing",
        "Launch & Scaling",
      ]}
      technologies={[
        "Next.js / React",
        "Node.js / Express",
        "PostgreSQL / MongoDB",
        "Redis / RabbitMQ",
        "AWS / Google Cloud",
        "Stripe / LemonSqueezy",
      ]}
        faqs={faqs}
      />
    </>
  );
}
