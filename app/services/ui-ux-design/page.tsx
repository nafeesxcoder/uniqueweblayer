import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Do I get the editable design files?",
    answer:
      "Yes. You receive the full Figma project with the component library, the colour and type styles, and every screen in desktop, tablet and mobile sizes. It is yours to keep and to hand to any developer.",
  },
  {
    question: "Can you redesign an existing product without rebuilding it?",
    answer:
      "Often yes. If the current front end is component-based we restyle it in place so the structure and data layer stay untouched. We audit the code first and tell you honestly whether a restyle or a rebuild is cheaper.",
  },
  {
    question: "Do you test the design with real users?",
    answer:
      "On request. We run a clickable prototype past five to eight people in your audience, record where they hesitate, and fix those screens before development starts — which is far cheaper than fixing them in code.",
  },
  {
    question: "Can you design for an app we are building in-house?",
    answer:
      "Yes. We hand over a developer-ready file with spacing tokens, states, and exported assets, and stay available during the build to answer questions and review the implementation.",
  },
];

export const metadata = pageMeta({
  title: "UI/UX Design Services — Web & Mobile App Design",
  description:
    "UI/UX design services for websites and mobile apps: user research, wireframes, design systems and clickable Figma prototypes. Developer-ready files you own.",
  path: "/services/ui-ux-design",
  keywords: [
    "ui ux design services",
    "mobile app ui ux design company",
    "website redesign services",
    "figma design agency",
    "design system development",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function UiUxDesignServicePage() {
  const pricing = await getServicePricing("ui-ux-design");
  return (
    <>
      <ServiceSeo slug="ui-ux-design" faqs={faqs} />
      <ServiceDetail
        title="UI/UX Design"
        category="Product & Interface Design 🎨"
        icon="fa-pen-ruler"
        color="#f472b6"
        gradient="from-pink-500 to-rose-600"
        targetAudience={[
          "Startups validating a product idea",
          "Businesses with a dated website",
          "Apps with high drop-off in the funnel",
          "Teams that have developers but no designer",
          "Agencies needing white-label design",
        ]}
        features={[
          "User research & competitor teardown",
          "Information architecture & user flows",
          "Low-fidelity wireframes for every screen",
          "High-fidelity UI for desktop, tablet & mobile",
          "Reusable design system & component library",
          "Clickable prototype you can walk through",
          "Accessibility & contrast checks",
          "Developer handoff with spacing tokens",
          "Exported icons, images & assets",
          "Two rounds of revisions included",
        ]}
        description="Wireframes, design systems and prototypes created before a line of code is written."
        longDescription="Most expensive rebuilds start as a design that was never thought through. We begin with the job the product has to do and the people who will use it, map the flows, then draw the screens — wireframes first so structure is argued about cheaply, then full visual design with a component library behind it. You approve a clickable prototype you can actually click through on your phone before development is quoted, and the developer gets a file with real spacing rules, states and exported assets rather than a flat picture to guess from. The outcome is fewer surprises during the build, fewer change requests after it, and a product that looks deliberate rather than assembled."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Decisions made in design, not mid-build",
          "A prototype you can test before paying for code",
          "A design system that keeps future screens consistent",
          "Editable Figma files you own outright",
          "Developer-ready handoff, any dev team",
        ]}
        process={[
          "Discovery call & competitor teardown",
          "User flows and information architecture",
          "Wireframes for every screen, approved first",
          "Visual design and component library",
          "Clickable prototype and revision rounds",
          "Developer handoff and build support",
        ]}
        technologies={[
          "Figma",
          "Design Tokens",
          "Auto Layout & Variants",
          "Prototyping & User Testing",
          "WCAG Contrast Checks",
          "Tailwind-ready spacing scales",
        ]}
        faqs={faqs}
      />
    </>
  );
}
