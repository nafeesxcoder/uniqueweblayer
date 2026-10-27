import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Can customers order food directly from the website?",
    answer:
      "Yes — your own ordering system with menu, cart, delivery or pickup, scheduled orders and online payment. Orders arrive on a tablet dashboard or by printer, and you keep 100% of the order value instead of paying aggregator commission.",
  },
  {
    question: "Can we take table reservations too?",
    answer:
      "Yes — live table availability, party size rules, time slots and confirmation messages, with the option to take a card deposit for large bookings.",
  },
  {
    question: "How easy is it to update the menu?",
    answer:
      "You update items, prices, photos and availability from an admin dashboard; sold-out items can be switched off in seconds. No developer needed for daily changes.",
  },
  {
    question: "Will the restaurant show up in local Google searches?",
    answer:
      "The site is built with LocalBusiness and Menu schema, fast mobile pages and location content, which is the on-site half. The other half is your Google Business Profile — we optimise that as part of the local SEO service.",
  },
];
export const metadata = pageMeta({
  title: "Restaurant Website Development — Menus, Booking & Ordering",
  description: "Restaurant and food business website development: digital menus, table reservation, online ordering and delivery integrations. Built for venues worldwide.",
  path: "/services/restaurant",
  keywords: ["restaurant website development", "food ordering website development", "cafe website design company", "table reservation website"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function RestaurantServicePage() {
  const pricing = await getServicePricing("restaurant");
  return (
    <>
      <ServiceSeo slug="restaurant" faqs={faqs} />
      <ServiceDetail
      title="Restaurant / Food Website"
      category="Easy + Fast Projects 🍔"
      icon="fa-utensils"
      color="#f97316"
      gradient="from-orange-500 to-amber-600"
      targetAudience={[
        "Restaurants & Cafes",
        "Food Trucks",
        "Bars & Pubs",
        "Bakeries",
        "Fast Food Chains",
      ]}
      features={[
        "Menu Display with Prices",
        "Online Ordering System",
        "Table Reservation",
        "Location & Hours",
        "Google Maps Integration",
        "Photo Gallery",
        "Customer Reviews",
        "Delivery Integration",
        "Special Offers Section",
        "Mobile Optimized",
      ]}
      description="Increase orders with a modern and mobile-friendly website"
      longDescription="Get more customers and increase orders with a stunning restaurant website. We build modern, mouth-watering websites for restaurants, cafes and food businesses. With online ordering, table reservations, and beautiful menu displays, your customers can easily discover your food and place orders from anywhere."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Increase Online Orders",
        "Attract More Customers",
        "Showcase Your Menu Beautifully",
        "Easy Reservation Management",
        "Mobile Ordering Ready",
      ]}
      process={[
        "Menu & Service Planning",
        "Design & Gallery Setup",
        "Ordering System Development",
        "Payment Integration",
        "Testing & Launch",
        "Staff Training",
      ]}
      technologies={[
        "React / Next.js",
        "Tailwind CSS",
        "Node.js / Express",
        "MongoDB / PostgreSQL",
        "Stripe / PayPal",
      ]}
        faqs={faqs}
      />
    </>
  );
}
