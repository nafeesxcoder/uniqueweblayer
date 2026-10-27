import Script from "next/script";
import ContactClient from "./ContactClient";
import { pageMeta, breadcrumbSchema, jsonLd } from "../lib/seo";
import { SITE_URL, company } from "../data/site";

export const metadata = pageMeta({
  title: "Contact — Get a Free Quote for Your Website, App or SEO",
  description:
    "Tell us about your project and get a fixed quote, scope and timeline — usually within one working day. Email, WhatsApp or the form. Clients worldwide, replies in under six hours.",
  path: "/contact",
  keywords: [
    "contact web development company",
    "get a website quote",
    "hire app developers",
    "free project quote",
  ],
});

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE_URL}/contact`,
  name: `Contact ${company.name}`,
  mainEntity: {
    "@id": `${SITE_URL}/#organization`,
  },
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(contactSchema)}
      />
      <Script
        id="contact-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        )}
      />
      <ContactClient asPageHeading />
    </>
  );
}
