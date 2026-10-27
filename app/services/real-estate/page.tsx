import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Can the site pull listings from an MLS or portal feed?",
    answer:
      "Yes, where the feed is available to you — MLS, IDX, a CRM export or a portal API. Listings then update automatically instead of being re-entered by hand. Without a feed, agents add properties through the admin panel.",
  },
  {
    question: "Does it include map search and filters?",
    answer:
      "Yes — map view with pins, draw-on-map search, and filters for price, bedrooms, property type, area and amenities. Filter results stay shareable through the URL so agents can send a filtered list to a client.",
  },
  {
    question: "Can leads go straight into our CRM?",
    answer:
      "Yes. Enquiry forms, valuation requests and viewing bookings can push directly into HubSpot, Salesforce, Zoho or a custom CRM, with the property details attached to the lead.",
  },
  {
    question: "Will each property page be found on Google?",
    answer:
      "Each listing gets its own URL, metadata and RealEstateListing schema, so properties can appear as rich results. We also build area pages, which is what usually ranks for 'flats in <area>' type searches.",
  },
];

export const metadata = pageMeta({
  title: "Real Estate Website Development — Property Portals",
  description: "Real estate website development with property listings, map search, agent profiles, lead capture and CRM integration. Built for brokers and developers worldwide.",
  path: "/services/real-estate",
  keywords: ["real estate website development", "property listing website development", "realtor website design company", "property portal development"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function RealEstateServicePage() {
  const pricing = await getServicePricing("real-estate");
  return (
    <>
      <ServiceSeo slug="real-estate" faqs={faqs} />
      <ServiceDetail
      title="Real Estate Website"
      category="Popular Among Foreign Clients 🏢"
      icon="fa-home"
      color="#ef4444"
      gradient="from-red-500 to-orange-600"
      targetAudience={[
        "Property Dealers",
        "Real Estate Agents",
        "Property Management Companies",
        "Builders & Developers",
        "Rental Agencies",
      ]}
      features={[
        "Property Listings",
        "Advanced Search Filters",
        "Map Integration",
        "Property Details Page",
        "Agent Profiles",
        "Contact Forms",
        "Mortgage Calculator",
        "Virtual Tours (Optional)",
        "Saved Properties",
        "Admin Dashboard",
      ]}
      description="Showcase properties with advanced search and attract serious buyers"
      longDescription="Help buyers find their dream property with a professional real estate website. We build feature-rich real estate platforms with advanced search, map integration and detailed property listings. Whether you're selling, renting, or managing properties, your website will attract serious buyers and streamline your business."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Attract Serious Buyers",
        "Showcase Properties Beautifully",
        "Easy Property Management",
        "Better Search Experience",
        "Generate More Leads",
      ]}
      process={[
        "Property Database Planning",
        "Design & Filter Development",
        "Map Integration",
        "Property Entry & Testing",
        "Launch & Training",
        "Marketing Support",
      ]}
      technologies={[
        "Next.js / React",
        "Node.js / Express",
        "MongoDB / PostgreSQL",
        "Google Maps API",
        "Cloudinary for Images",
      ]}
        faqs={faqs}
      />
    </>
  );
}
