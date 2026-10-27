/**
 * Service catalogue — single source of truth.
 * The header dropdown, the /services page, the footer and the sitemap all read this file.
 * To add a service: add an entry here, then create app/services/<slug>/page.tsx.
 */

/**
 * The seven service lines the company sells. Every individual service below
 * belongs to exactly one of them, and the header dropdown, the /services page
 * and the portfolio filter are all driven by this list.
 *
 * The slugs must stay in sync with src/config/serviceTypes.js in the
 * uniqueweblayer-backend repo. They live in separate repositories, so a change
 * here needs the matching change there — nothing will warn you.
 */
export type ServiceCategory =
  | "Web Development"
  | "Mobile App Development"
  | "Software Development"
  | "UI/UX Design"
  | "Digital Marketing"
  | "AI Solutions"
  | "DIY Tech Projects";

export interface ServiceItem {
  slug: string;
  name: string;
  shortName: string;
  category: ServiceCategory;
  icon: string; // Font Awesome class, e.g. "fa-globe"
  color: string;
  gradient: string;
  description: string;
  price: string;
  delivery: string;
  /** Primary keywords used for the page <title> and meta description. */
  keywords: string[];
}

export const services: ServiceItem[] = [
  /* ----------------------- Web Development ----------------------- */
  {
    slug: "business",
    name: "Business / Company Website",
    shortName: "Business Website",
    category: "Web Development",
    icon: "fa-building",
    color: "#8b5cf6",
    gradient: "from-purple-500 to-indigo-600",
    description:
      "Corporate websites that explain what you do and turn visitors into enquiries.",
    price: "$499",
    delivery: "2-3 weeks",
    keywords: [
      "business website development",
      "corporate website design",
      "company website developer",
    ],
  },
  {
    slug: "ecommerce",
    name: "E-Commerce Website",
    shortName: "E-Commerce",
    category: "Web Development",
    icon: "fa-cart-shopping",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-600",
    description:
      "Online stores with payments, inventory, multi-currency checkout and order tracking.",
    price: "$999",
    delivery: "4-6 weeks",
    keywords: [
      "ecommerce website development",
      "online store development",
      "shopping website developer",
    ],
  },
  {
    slug: "landing",
    name: "Landing Page",
    shortName: "Landing Page",
    category: "Web Development",
    icon: "fa-bullseye",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
    description:
      "High-converting single pages built for ad campaigns and product launches.",
    price: "$199",
    delivery: "1-2 weeks",
    keywords: [
      "landing page design",
      "high converting landing page",
      "campaign landing page developer",
    ],
  },
  {
    slug: "portfolio",
    name: "Portfolio Website",
    shortName: "Portfolio",
    category: "Web Development",
    icon: "fa-user-tie",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    description:
      "Personal and studio portfolios that present your work like a premium brand.",
    price: "$349",
    delivery: "2-3 weeks",
    keywords: [
      "portfolio website design",
      "personal portfolio developer",
      "creative portfolio website",
    ],
  },
  {
    slug: "blog",
    name: "Blog / Content Website",
    shortName: "Blog Website",
    category: "Web Development",
    icon: "fa-newspaper",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-600",
    description:
      "Content platforms with a CMS, categories, newsletters and SEO built in.",
    price: "$299",
    delivery: "2-3 weeks",
    keywords: [
      "blog website development",
      "content website with CMS",
      "news website developer",
    ],
  },
  {
    slug: "booking",
    name: "Booking / Appointment Website",
    shortName: "Booking System",
    category: "Web Development",
    icon: "fa-calendar-check",
    color: "#6366f1",
    gradient: "from-indigo-500 to-violet-600",
    description:
      "Calendars, slot management, reminders and online payments for service businesses.",
    price: "$449",
    delivery: "3-4 weeks",
    keywords: [
      "appointment booking website",
      "online booking system development",
      "reservation website developer",
    ],
  },
  {
    slug: "lms",
    name: "Education / LMS Website",
    shortName: "LMS Portal",
    category: "Software Development",
    icon: "fa-graduation-cap",
    color: "#3b82f6",
    gradient: "from-blue-500 to-sky-600",
    description:
      "Course platforms with video lessons, quizzes, certificates and student dashboards.",
    price: "$799",
    delivery: "4-6 weeks",
    keywords: [
      "LMS website development",
      "online course platform development",
      "e-learning website developer",
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate Website",
    shortName: "Real Estate",
    category: "Web Development",
    icon: "fa-house",
    color: "#14b8a6",
    gradient: "from-teal-500 to-emerald-600",
    description:
      "Property listings, map search, agent profiles and lead capture with CRM sync.",
    price: "$649",
    delivery: "4-5 weeks",
    keywords: [
      "real estate website development",
      "property listing website",
      "realtor website developer",
    ],
  },
  {
    slug: "restaurant",
    name: "Restaurant / Food Website",
    shortName: "Restaurant",
    category: "Web Development",
    icon: "fa-utensils",
    color: "#ef4444",
    gradient: "from-red-500 to-orange-600",
    description:
      "Digital menus, table reservation, online ordering and delivery integrations.",
    price: "$349",
    delivery: "2-3 weeks",
    keywords: [
      "restaurant website development",
      "food ordering website",
      "cafe website designer",
    ],
  },
  {
    slug: "saas",
    name: "SaaS / Web App",
    shortName: "SaaS Web App",
    category: "Software Development",
    icon: "fa-cloud",
    color: "#a855f7",
    gradient: "from-purple-500 to-pink-600",
    description:
      "Multi-tenant products with auth, subscriptions, dashboards and scalable APIs.",
    price: "$1499",
    delivery: "6-10 weeks",
    keywords: [
      "SaaS development company",
      "web application development",
      "custom dashboard development",
    ],
  },
  {
    slug: "membership",
    name: "Membership Website",
    shortName: "Membership",
    category: "Web Development",
    icon: "fa-users-gear",
    color: "#f97316",
    gradient: "from-orange-500 to-amber-600",
    description:
      "Gated content, recurring billing, member tiers and community features.",
    price: "$899",
    delivery: "4-5 weeks",
    keywords: [
      "membership website development",
      "subscription website developer",
      "paid community platform",
    ],
  },
  {
    slug: "custom-software",
    name: "Custom Web Application (MERN)",
    shortName: "Custom Web App",
    category: "Software Development",
    icon: "fa-gears",
    color: "#7c3aed",
    gradient: "from-violet-600 to-purple-700",
    description:
      "Bespoke internal tools, CRMs, ERPs and portals built on the MERN stack.",
    price: "$1999",
    delivery: "8-12 weeks",
    keywords: [
      "MERN stack development company",
      "custom software development",
      "CRM and ERP development",
    ],
  },

  /* ---------------------- Mobile App Development ---------------------- */
  {
    slug: "mobile-app",
    name: "Mobile App Development",
    shortName: "Mobile Apps",
    category: "Mobile App Development",
    icon: "fa-mobile-screen-button",
    color: "#22d3ee",
    gradient: "from-cyan-500 to-blue-600",
    description:
      "Android and iOS apps from one codebase — design, build, store launch and updates.",
    price: "$1499",
    delivery: "6-10 weeks",
    keywords: [
      "mobile app development company",
      "android and ios app development",
      "cross platform app developer",
    ],
  },
  {
    slug: "react-native",
    name: "React Native App Development",
    shortName: "React Native Apps",
    category: "Mobile App Development",
    icon: "fa-react",
    color: "#61dafb",
    gradient: "from-sky-400 to-cyan-600",
    description:
      "One React Native codebase shipping native-quality apps to both app stores.",
    price: "$1699",
    delivery: "6-10 weeks",
    keywords: [
      "react native app development company",
      "hire react native developer",
      "react native cross platform app",
    ],
  },
  {
    slug: "flutter",
    name: "Flutter App Development",
    shortName: "Flutter Apps",
    category: "Mobile App Development",
    icon: "fa-bolt",
    color: "#45d1fd",
    gradient: "from-blue-400 to-indigo-600",
    description:
      "Flutter apps with pixel-perfect UI and 60fps performance on Android, iOS and web.",
    price: "$1699",
    delivery: "6-10 weeks",
    keywords: [
      "flutter app development company",
      "hire flutter developer",
      "flutter android ios app",
    ],
  },

  /* ------------------- Digital Marketing (SEO side) ------------------- */
  {
    slug: "seo",
    name: "SEO Services",
    shortName: "SEO Services",
    category: "Digital Marketing",
    icon: "fa-magnifying-glass-chart",
    color: "#84cc16",
    gradient: "from-lime-500 to-green-600",
    description:
      "Technical, on-page, local and international SEO that moves you onto page one.",
    price: "$299/mo",
    delivery: "Ongoing · first audit in 7 days",
    keywords: [
      "SEO services company",
      "search engine optimization agency",
      "international SEO services",
    ],
  },
  {
    slug: "local-seo",
    name: "Local & International SEO",
    shortName: "Local SEO",
    category: "Digital Marketing",
    icon: "fa-location-dot",
    color: "#eab308",
    gradient: "from-yellow-500 to-amber-600",
    description:
      "Google Business Profile, map pack rankings and country-level search visibility.",
    price: "$249/mo",
    delivery: "Ongoing · profile live in 7-14 days",
    keywords: [
      "local SEO services",
      "google business profile optimization",
      "multi country SEO",
    ],
  },
  {
    slug: "maintenance",
    name: "Website Maintenance & Support",
    shortName: "Maintenance",
    category: "Web Development",
    icon: "fa-screwdriver-wrench",
    color: "#94a3b8",
    gradient: "from-slate-500 to-gray-600",
    description:
      "Updates, backups, uptime monitoring, security patches and monthly improvements.",
    price: "$149/mo",
    delivery: "Ongoing · onboarding in 3-5 days",
    keywords: [
      "website maintenance services",
      "website support plans",
      "website security and backup",
    ],
  },

  /* ------------------------- UI/UX Design ------------------------- */
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    shortName: "UI/UX Design",
    category: "UI/UX Design",
    icon: "fa-pen-ruler",
    color: "#f472b6",
    gradient: "from-pink-500 to-rose-600",
    description:
      "Wireframes, design systems and clickable prototypes for web and mobile — designed before a line of code is written.",
    price: "$399",
    delivery: "1-3 weeks",
    keywords: [
      "ui ux design services",
      "mobile app ui design",
      "website redesign agency",
    ],
  },

  /* ----------------------- Digital Marketing ---------------------- */
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortName: "Digital Marketing",
    category: "Digital Marketing",
    icon: "fa-bullhorn",
    color: "#22d3ee",
    gradient: "from-cyan-500 to-sky-600",
    description:
      "Google and Meta ads, social media, content and email campaigns run against revenue targets, not vanity metrics.",
    price: "$299/mo",
    delivery: "Ongoing",
    keywords: [
      "digital marketing agency",
      "google ads management",
      "social media marketing services",
    ],
  },

  /* ------------------------- AI Solutions ------------------------- */
  {
    slug: "ai-solution",
    name: "AI Solutions",
    shortName: "AI Solutions",
    category: "AI Solutions",
    icon: "fa-robot",
    color: "#818cf8",
    gradient: "from-indigo-500 to-violet-600",
    description:
      "AI chatbots, document and data assistants, and workflow automations wired into the tools your team already uses.",
    price: "$699",
    delivery: "2-5 weeks",
    keywords: [
      "ai chatbot development",
      "ai automation services",
      "custom ai solutions company",
    ],
  },

  /* ----------------------- DIY Tech Projects ---------------------- */
  {
    slug: "diy-tech",
    name: "DIY Tech Projects",
    shortName: "DIY Tech",
    category: "DIY Tech Projects",
    icon: "fa-microchip",
    color: "#facc15",
    gradient: "from-yellow-400 to-amber-500",
    description:
      "IoT builds, Raspberry Pi and Arduino prototypes, automation rigs and final-year engineering projects, delivered with source and documentation.",
    price: "$199",
    delivery: "1-4 weeks",
    keywords: [
      "iot project development",
      "arduino raspberry pi projects",
      "final year engineering project help",
    ],
  },
];

export const serviceCategories: ServiceCategory[] = [
  "Web Development",
  "Mobile App Development",
  "Software Development",
  "UI/UX Design",
  "Digital Marketing",
  "AI Solutions",
  "DIY Tech Projects",
];

/**
 * Category → portfolio filter slug. These slugs are what the backend stores in
 * projects.service_type; see src/config/serviceTypes.js in the backend repo.
 */
export const categorySlugs: Record<ServiceCategory, string> = {
  "Web Development": "web-development",
  "Mobile App Development": "mobile-app",
  "Software Development": "software-development",
  "UI/UX Design": "ui-ux-design",
  "Digital Marketing": "digital-marketing",
  "AI Solutions": "ai-solution",
  "DIY Tech Projects": "diy-tech",
};

/** Headline icon + blurb per service line, used on the home and services pages. */
export const serviceLines: {
  category: ServiceCategory;
  slug: string;
  icon: string;
  color: string;
  gradient: string;
  summary: string;
}[] = [
  {
    category: "Web Development",
    slug: "web-development",
    icon: "fa-globe",
    color: "#8b5cf6",
    gradient: "from-purple-500 to-indigo-600",
    summary:
      "Business sites, online stores, booking platforms and landing pages built on Next.js and React.",
  },
  {
    category: "Mobile App Development",
    slug: "mobile-app",
    icon: "fa-mobile-screen",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-600",
    summary:
      "Android and iOS apps in React Native and Flutter, from MVP through to store release.",
  },
  {
    category: "Software Development",
    slug: "software-development",
    icon: "fa-code",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-600",
    summary:
      "SaaS products, dashboards, ERP and CRM tools, APIs and internal systems built to your workflow.",
  },
  {
    category: "UI/UX Design",
    slug: "ui-ux-design",
    icon: "fa-pen-ruler",
    color: "#f472b6",
    gradient: "from-pink-500 to-rose-600",
    summary:
      "Research, wireframes, design systems and prototypes that make the build predictable.",
  },
  {
    category: "Digital Marketing",
    slug: "digital-marketing",
    icon: "fa-bullhorn",
    color: "#22d3ee",
    gradient: "from-cyan-500 to-sky-600",
    summary:
      "SEO, paid search, social and content campaigns measured against enquiries and revenue.",
  },
  {
    category: "AI Solutions",
    slug: "ai-solution",
    icon: "fa-robot",
    color: "#818cf8",
    gradient: "from-indigo-500 to-violet-600",
    summary:
      "Chatbots, AI assistants and automations that remove the repetitive work from your team's day.",
  },
  {
    category: "DIY Tech Projects",
    slug: "diy-tech",
    icon: "fa-microchip",
    color: "#facc15",
    gradient: "from-yellow-400 to-amber-500",
    summary:
      "IoT, Raspberry Pi and Arduino builds, automation rigs and engineering project work.",
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

export const servicesByCategory = (category: ServiceCategory) =>
  services.filter((s) => s.category === category);
