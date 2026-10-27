import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "How is paid content protected?",
    answer:
      "Access is checked on the server, not hidden with JavaScript, so paywalled content never reaches a non-member's browser. Video uses signed URLs that expire, which stops link sharing.",
  },
  {
    question: "Can we offer different membership tiers?",
    answer:
      "Yes — multiple tiers with their own pricing, content access and perks, plus free trials, annual discounts and coupon codes. Members can upgrade or downgrade themselves.",
  },
  {
    question: "Does it include a community area?",
    answer:
      "It can — discussion threads, comments, member directory and direct messages. If you would rather use Discord, Circle or Slack for community, we integrate membership status with those instead.",
  },
  {
    question: "What happens when someone cancels?",
    answer:
      "Access continues until the paid period ends, then downgrades automatically. You get churn visibility in the dashboard, and we can set up win-back emails for cancelled members.",
  },
];

export const metadata = pageMeta({
  title: "Membership Website Development — Subscriptions & Gated Content",
  description: "Membership website development with gated content, recurring billing, member tiers and community features. Subscription platforms built for clients worldwide.",
  path: "/services/membership",
  keywords: ["membership website development", "subscription website developer", "paid community platform development", "gated content website"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function MembershipServicePage() {
  const pricing = await getServicePricing("membership");
  return (
    <>
      <ServiceSeo slug="membership" faqs={faqs} />
      <ServiceDetail
      title="Membership Website"
      category="Recurring Income Model 🔐"
      icon="fa-users"
      color="#06b6d4"
      gradient="from-cyan-500 to-blue-600"
      targetAudience={[
        "Content Creators",
        "Coaches & Mentors",
        "Course Creators",
        "Community Builders",
        "Subscription Businesses",
      ]}
      features={[
        "User Registration & Login",
        "Paid Content Access",
        "Multiple Subscription Plans",
        "Member Dashboard",
        "Content Drip Scheduling",
        "Community Forums",
        "Payment Integration",
        "Email Automation",
      ]}
      description="Monetize your content with membership-based platforms"
      longDescription="Create a recurring revenue stream with a membership website. We build platforms where you can offer exclusive content, courses, or community access to paying members. With flexible subscription plans, content dripping, and member management tools, you'll have everything you need to build a successful membership business."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Recurring Monthly Income",
        "Build Loyal Community",
        "Exclusive Content Delivery",
        "Member Insights",
        "Scalable Platform",
      ]}
      process={[
        "Membership Structure Planning",
        "Content Strategy",
        "Platform Development",
        "Payment & Subscription Setup",
        "Testing & Launch",
        "Member Onboarding",
      ]}
      technologies={[
        "Next.js / React",
        "Node.js / Express",
        "PostgreSQL / MongoDB",
        "Stripe / Paddle",
        "SendGrid / Mailchimp",
      ]}
        faqs={faqs}
      />
    </>
  );
}
