import Script from "next/script";
import {
  serviceSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
} from "../lib/seo";
import { getService } from "../data/services";

/**
 * Server component: emits the structured data for a single service page.
 * Usage inside app/services/<slug>/page.tsx:  <ServiceSeo slug="seo" faqs={faqs} />
 */
export default function ServiceSeo({
  slug,
  faqs,
}: {
  slug: string;
  faqs?: { question: string; answer: string }[];
}) {
  const service = getService(slug);
  const schema = serviceSchema(slug);

  return (
    <>
      {schema && (
        <Script
          id={`service-schema-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(schema)}
        />
      )}
      <Script
        id={`service-breadcrumb-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            {
              name: service?.name ?? slug,
              path: `/services/${slug}`,
            },
          ]),
        )}
      />
      {faqs && faqs.length > 0 && (
        <Script
          id={`service-faq-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))}
        />
      )}
    </>
  );
}
