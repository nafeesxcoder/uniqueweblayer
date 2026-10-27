import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "What exactly is the MERN stack?",
    answer:
      "MongoDB, Express.js, React and Node.js — one JavaScript language across database, API and interface. It means a smaller team can build and maintain the whole system, and developers are easy to hire later.",
  },
  {
    question: "Can you integrate with software we already use?",
    answer:
      "Yes. We regularly integrate CRMs, accounting systems, payment gateways, shipping providers, WhatsApp Business, Google Workspace and custom legacy APIs. If it has an API or a database we can connect to it.",
  },
  {
    question: "Who owns the code and the data?",
    answer:
      "You do, completely. The repository is yours from day one, hosting runs under your accounts, and we hand over documentation and credentials at launch. There is no licence fee and no lock-in.",
  },
  {
    question: "Can you maintain the system after launch?",
    answer:
      "Yes — through a monthly support plan covering bug fixes, security updates, backups, monitoring and a block of hours for new features.",
  },
];

export const metadata = pageMeta({
  title: "Custom Software & MERN Stack Development Company",
  description:
    "Custom web application development on the MERN stack — CRMs, ERPs, admin dashboards, portals and internal tools. Built, integrated and handed over with full source code, for clients worldwide.",
  path: "/services/custom-software",
  keywords: [
    "MERN stack development company",
    "custom software development company",
    "custom web application development",
    "CRM development services",
    "internal tools development",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function CustomSoftwareServicePage() {
  const pricing = await getServicePricing("custom-software");
  return (
    <>
      <ServiceSeo slug="custom-software" faqs={faqs} />
      <ServiceDetail
        title="Custom Web Application (MERN)"
        category="Enterprise Grade ⚙️"
        icon="fa-gears"
        color="#7c3aed"
        gradient="from-violet-600 to-purple-700"
        targetAudience={[
          "Businesses outgrowing spreadsheets",
          "Companies needing a custom CRM or ERP",
          "Operations teams with manual workflows",
          "Marketplaces and multi-vendor platforms",
          "Enterprises replacing legacy software",
        ]}
        features={[
          "Custom database and data modelling",
          "Role-based access control",
          "Admin dashboards & reporting",
          "Workflow automation & approvals",
          "Third-party API integrations",
          "Document generation (PDF, invoices)",
          "Audit logs & activity history",
          "Bulk import/export and migrations",
          "Secure authentication (SSO, 2FA)",
          "Deployment, monitoring & backups",
        ]}
        description="Bespoke internal systems, CRMs and portals built on the MERN stack and handed over to you."
        longDescription="When off-the-shelf software forces your team to work around it, a custom system usually pays for itself quickly. We map how your business actually runs, then build exactly that: the data model, the roles and permissions, the screens your staff use every day, the reports your managers need, and the integrations that remove the copy-paste work in between. Built on MongoDB, Express, React and Node.js, deployed to your own cloud account, documented and handed over with the complete source code. Everything ships in sprints with a staging environment you can test at any point, so the system is shaped with your team rather than presented to them at the end."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Fits your process exactly",
          "No per-seat licence fees",
          "Removes manual, repetitive work",
          "Scales as your team grows",
          "Full ownership of code and data",
        ]}
        process={[
          "Process mapping & requirement workshops",
          "Data model and architecture design",
          "UI/UX design for each user role",
          "Sprint development with staging demos",
          "Integration, migration and UAT",
          "Deployment, training and support",
        ]}
        technologies={[
          "MongoDB / PostgreSQL",
          "Express.js / Node.js",
          "React / Next.js",
          "TypeScript",
          "Docker / AWS / VPS",
          "REST & GraphQL APIs",
        ]}
        faqs={faqs}
      />
    </>
  );
}
