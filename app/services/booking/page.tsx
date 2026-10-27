import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Can customers book and pay in one flow?",
    answer:
      "Yes — they pick a service, see live availability, choose a slot and pay a deposit or the full amount at the same time. Taking payment at booking is the single biggest reduction in no-shows.",
  },
  {
    question: "Does it sync with Google Calendar or Outlook?",
    answer:
      "Yes, two-way. Bookings appear in your calendar and anything blocked in your calendar disappears from your public availability, so you never get double-booked.",
  },
  {
    question: "Can it handle multiple staff members or locations?",
    answer:
      "Yes. Each staff member gets their own services, working hours and calendar, and customers can either pick a specific person or take the first available. The same applies to multiple branches.",
  },
  {
    question: "What about reminders and cancellations?",
    answer:
      "Automatic email and SMS or WhatsApp reminders before the appointment, plus a self-service link for customers to reschedule or cancel within the rules you set.",
  },
];

export const metadata = pageMeta({
  title: "Booking & Appointment Website Development",
  description: "Online booking and appointment website development: calendars, slot management, reminders, payments and admin dashboards for service businesses worldwide.",
  path: "/services/booking",
  keywords: ["appointment booking website development", "online booking system development", "reservation website developer", "scheduling software development"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function BookingServicePage() {
  const pricing = await getServicePricing("booking");
  return (
    <>
      <ServiceSeo slug="booking" faqs={faqs} />
      <ServiceDetail
      title="Booking / Appointment Website"
      category="High Demand Real-world Use Case 📅"
      icon="fa-calendar-check"
      color="#3b82f6"
      gradient="from-blue-500 to-cyan-600"
      targetAudience={[
        "Salons & Spas",
        "Doctors & Clinics",
        "Coaches & Consultants",
        "Fitness Trainers",
        "Service Providers",
      ]}
      features={[
        "Interactive Calendar View",
        "Online Booking System",
        "Email/SMS Confirmation",
        "Availability Management",
        "Customer Profiles",
        "Appointment Reminders",
        "Reschedule/Cancel Options",
        "Payment Integration (Optional)",
        "Admin Dashboard",
        "Calendar Sync (Google/Outlook)",
      ]}
      description="Allow customers to book appointments easily online"
      longDescription="Save time and reduce no-shows with an online booking system. We build appointment websites that let your customers book services 24/7 in their own time zone. With automated reminders, calendar integration, and easy management tools, you'll never miss an appointment again. Perfect for salons, clinics, coaches, and any service-based business."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "24/7 Booking Available",
        "Reduce No-Shows Significantly",
        "Save Admin Time",
        "Better Customer Experience",
        "Increased Bookings",
      ]}
      process={[
        "Service & Availability Planning",
        "Calendar Interface Design",
        "Booking System Development",
        "Notification Setup",
        "Testing & Optimization",
        "Staff Training",
      ]}
      technologies={[
        "React / Next.js",
        "Node.js / Express",
        "MongoDB / PostgreSQL",
        "Calendar APIs",
        "Twilio / SendGrid",
      ]}
        faqs={faqs}
      />
    </>
  );
}
