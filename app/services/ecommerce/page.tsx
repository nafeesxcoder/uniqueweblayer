import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Which payment gateways can you integrate?",
    answer:
      "Stripe and PayPal work almost everywhere. We also integrate local gateways where your customers expect them — Razorpay and UPI in India, iDEAL and Mollie in the Netherlands, Klarna in Scandinavia, PayTabs and Telr in the Gulf, PayFast in South Africa, Afterpay in Australia.",
  },
  {
    question: "Can the store sell in multiple currencies and countries?",
    answer:
      "Yes. We set up multi-currency pricing, country-based tax and shipping rules, and localised checkout fields. Where you sell into several markets we also structure the catalogue so each market can be targeted separately in search.",
  },
  {
    question: "Is this built on Shopify or custom?",
    answer:
      "We build custom stores on Next.js with your choice of commerce backend, which avoids monthly platform fees and per-transaction cuts, and gives you full control over the design and checkout. If Shopify genuinely fits your case better, we will say so.",
  },
  {
    question: "How do you handle inventory and order management?",
    answer:
      "You get an admin dashboard for products, stock levels, orders, refunds and customers. It can also sync with an existing ERP or accounting system through its API.",
  },
];

export const metadata = pageMeta({
  title: "E-Commerce Website Development Company — Online Stores",
  description: "E-commerce website development with payment gateways, inventory, multi-currency checkout and order tracking. Online stores built for businesses in every country.",
  path: "/services/ecommerce",
  keywords: ["ecommerce website development company", "online store development", "shopping website developer", "multi currency ecommerce website"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function EcommerceServicePage() {
  const pricing = await getServicePricing("ecommerce");
  return (
    <>
      <ServiceSeo slug="ecommerce" faqs={faqs} />
      <ServiceDetail
      title="E-Commerce Website"
      category="Online Stores & Product Sellers 💰"
      icon="fa-cart-shopping"
      color="#ec4899"
      gradient="from-pink-500 to-rose-600"
      targetAudience={[
        "Online Retailers",
        "Product Sellers",
        "Dropshippers",
        "Brand Owners",
      ]}
      features={[
        "Product Listing with Filters",
        "Shopping Cart System",
        "Secure Payment Gateway",
        "Order Tracking & Management",
        "User Accounts & Profiles",
        "Inventory Management",
        "Admin Dashboard",
      ]}
      description="Sell your products worldwide with a secure and scalable online store"
      longDescription="Launch your online store with a fully functional e-commerce platform. We build secure, scalable online stores that sell globally — multi-currency pricing, local payment gateways and country-aware shipping. From product listings to payment processing, everything is handled seamlessly."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Sell 24/7 Worldwide",
        "Secure Payment Processing",
        "Automated Order Management",
        "Inventory Tracking",
      ]}
      process={[
        "Product Catalog Planning",
        "UI/UX Design for Store",
        "Development & Integration",
        "Payment Gateway Setup",
        "Testing & Launch",
      ]}
      technologies={[
        "Next.js / React",
        "Node.js / Express",
        "MongoDB / PostgreSQL",
        "Stripe / PayPal API",
      ]}
        faqs={faqs}
      />
    </>
  );
}
