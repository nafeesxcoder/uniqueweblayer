import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Can students pay for individual courses and subscriptions?",
    answer:
      "Yes — one-off course purchases, bundles, subscription plans or cohort-based enrolment, with Stripe, Razorpay or a local gateway. Access unlocks automatically on payment.",
  },
  {
    question: "How is video hosted and protected?",
    answer:
      "Through a dedicated video platform such as Mux, Vimeo or Bunny with signed playback URLs, so videos cannot simply be downloaded or hotlinked. Adaptive streaming keeps lessons watchable on slow connections.",
  },
  {
    question: "Do you build quizzes, progress tracking and certificates?",
    answer:
      "Yes — lesson completion tracking, quizzes with pass marks, course progress bars and auto-generated PDF certificates with the student's name and completion date.",
  },
  {
    question: "Can teachers upload their own courses?",
    answer:
      "Yes, if you want a multi-instructor platform. Instructors get their own dashboard for uploading lessons, and you keep approval control plus revenue-share reporting.",
  },
];

export const metadata = pageMeta({
  title: "LMS & Online Course Platform Development",
  description: "LMS and e-learning website development with video lessons, quizzes, certificates, student dashboards and payments. Course platforms built for educators worldwide.",
  path: "/services/lms",
  keywords: ["LMS website development company", "online course platform development", "e-learning website developer", "custom LMS development"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function LMSServicePage() {
  const pricing = await getServicePricing("lms");
  return (
    <>
      <ServiceSeo slug="lms" faqs={faqs} />
      <ServiceDetail
      title="Education / LMS Website"
      category="Trending Niche 🎓"
      icon="fa-graduation-cap"
      color="#14b8a6"
      gradient="from-teal-500 to-emerald-600"
      targetAudience={[
        "Coaching Centers",
        "Online Teachers",
        "Course Creators",
        "Schools & Academies",
        "Corporate Training",
      ]}
      features={[
        "Course Management System",
        "Video Lessons",
        "Student Dashboard",
        "Quiz & Assessment System",
        "Progress Tracking",
        "Certificate Generation",
        "Discussion Forums",
        "Payment Integration",
        "Instructor Profiles",
        "Analytics & Reports",
      ]}
      description="Create and sell online courses with a powerful learning platform"
      longDescription="Launch your own online learning platform and start selling courses today. We build complete Learning Management Systems (LMS) so you can create, manage and sell courses online. With video lessons, quizzes, student progress tracking, and certification, your students will have an engaging learning experience."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Passive Income Stream",
        "Reach Global Students",
        "Scalable Platform",
        "Track Student Progress",
        "Build Authority",
      ]}
      process={[
        "Course Structure Planning",
        "Platform Design",
        "Development & Integration",
        "Content Upload",
        "Testing & Launch",
        "Marketing Setup",
      ]}
      technologies={[
        "Next.js / React",
        "Node.js / Express",
        "MongoDB / PostgreSQL",
        "Video Hosting (Vimeo/Youtube)",
        "Payment Gateways",
      ]}
        faqs={faqs}
      />
    </>
  );
}
