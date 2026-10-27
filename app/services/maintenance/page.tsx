import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Do you maintain websites you didn't build?",
    answer:
      "Yes. We begin with an audit covering hosting, dependencies, security, backups and speed, then share a fix list and a monthly plan. Next.js, React, WordPress, Shopify and plain HTML sites are all fine.",
  },
  {
    question: "What happens if the site goes down?",
    answer:
      "Uptime monitoring alerts us automatically, usually before you notice. We investigate, restore from backup if needed and send you a short note on the cause and the fix.",
  },
  {
    question: "Are content changes included?",
    answer:
      "Yes — each plan includes a monthly block of hours for content updates, new sections, image changes and small features. Larger work is quoted separately before it starts.",
  },
];

export const metadata = pageMeta({
  title: "Website Maintenance & Support Services — Monthly Plans",
  description:
    "Website maintenance and support: updates, security patches, backups, uptime monitoring, speed optimisation and monthly content changes. Plans for websites and web apps worldwide.",
  path: "/services/maintenance",
  keywords: [
    "website maintenance services",
    "website support plans",
    "website security and backup service",
    "web application maintenance company",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function MaintenanceServicePage() {
  const pricing = await getServicePricing("maintenance");
  return (
    <>
      <ServiceSeo slug="maintenance" faqs={faqs} />
      <ServiceDetail
        title="Website Maintenance & Support"
        category="Ongoing Care 🛠️"
        icon="fa-screwdriver-wrench"
        color="#94a3b8"
        gradient="from-slate-500 to-gray-600"
        targetAudience={[
          "Businesses without an in-house developer",
          "Sites built by a previous agency",
          "E-commerce stores that cannot go down",
          "SaaS products needing routine upkeep",
          "Agencies outsourcing maintenance",
        ]}
        features={[
          "Dependency & framework updates",
          "Security patches and hardening",
          "Daily or weekly automated backups",
          "24/7 uptime monitoring with alerts",
          "Page speed & Core Web Vitals tuning",
          "Bug fixes and error monitoring",
          "Monthly content and design updates",
          "SSL, domain and DNS management",
          "Database optimisation",
          "Monthly health report",
        ]}
        description="Updates, backups, monitoring and monthly improvements so your site never goes stale."
        longDescription="A live website is not finished — dependencies age, plugins break, certificates expire and performance drifts. Our maintenance plans cover the routine work that keeps a site healthy: framework and package updates applied on staging first, security patches, automated backups you can restore from, uptime monitoring that alerts us before your customers notice, and regular speed checks against Core Web Vitals. Each plan also includes a monthly block of hours for the content and design changes every business needs, and you receive a short report showing what was updated, what was fixed and what we recommend next."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "No surprise downtime",
          "Security issues patched early",
          "Restorable backups, always",
          "A developer on call monthly",
          "Clear reports, no guesswork",
        ]}
        process={[
          "Technical and security audit",
          "Backup and monitoring setup",
          "Fix the critical issues found",
          "Scheduled monthly update cycle",
          "Performance and uptime tracking",
          "Monthly report and planning call",
        ]}
        technologies={[
          "Vercel / AWS / Hostinger VPS",
          "Cloudflare",
          "UptimeRobot / Better Stack",
          "Sentry",
          "GitHub Actions",
          "Lighthouse / PageSpeed",
        ]}
        faqs={faqs}
      />
    </>
  );
}
