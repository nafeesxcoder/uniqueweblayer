"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stars } from "./Stars";
import { DEFAULT_PRICING } from "../lib/pricing";
import { fetchPricing, type ServicePrice } from "../lib/api";
import Link from "next/link";
import Image from "next/image";
import {
  FiCheck,
  FiArrowRight,
  FiDollarSign,
  FiClock,
  FiTarget,
  FiStar,
  FiInfo,
} from "react-icons/fi";
import { FaRocket, FaCrown } from "react-icons/fa";
// React Icons for services
import {
  FaBuilding,
  FaShoppingCart,
  FaBullseye,
  FaUserAstronaut,
  FaBlog,
  FaCalendarCheck,
  FaGraduationCap,
  FaHome,
  FaUtensils,
  FaCloud,
  FaUsers,
  FaMobileAlt,
  FaReact,
  FaSearchDollar,
  FaCogs,
} from "react-icons/fa";
import { SiFlutter } from "react-icons/si";

export default function ServicesSection() {
  /*
   * Prices live in one place now — data/services.ts for the defaults, the
   * service_pricing table for anything changed in the admin panel. This
   * section used to carry its own copy, which had drifted: it showed $299 for
   * a blog while the service page said $399.
   */
  const [livePrices, setLivePrices] = useState<Record<string, ServicePrice>>({});

  useEffect(() => {
    let cancelled = false;
    fetchPricing()
      .then((list) => {
        if (cancelled) return;
        setLivePrices(Object.fromEntries(list.map((p) => [p.slug, p])));
      })
      .catch(() => {
        /* falls back to the bundled defaults below */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const priceFor = (slug: string) =>
    livePrices[slug] ?? DEFAULT_PRICING[slug] ?? null;

  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);

  // Services with correct prices from your data
  const services = [
    {
      id: 101,
      slug: "mobile-app",
      title: "Mobile App Development",
      category: "Android & iOS Apps",
      icon: FaMobileAlt,
      color: "#22d3ee",
      gradient: "from-cyan-500 to-blue-600",
      targetAudience: "Startups, Marketplaces, Service businesses",
      features: [
        "Android + iOS",
        "One codebase",
        "Push notifications",
        "In-app payments",
        "Admin panel",
        "Store launch",
      ],
      description:
        "Android and iOS apps from a single codebase — built, published and supported",
      price: "$1499",
      priceDisplay: "$1499",
      delivery: "6-10 weeks",
      image: "/mobile-app.png",
    },
    {
      id: 102,
      slug: "react-native",
      title: "React Native App Development",
      category: "Cross-Platform Apps",
      icon: FaReact,
      color: "#61dafb",
      gradient: "from-sky-400 to-cyan-600",
      targetAudience: "Startups, Web products going mobile, Agencies",
      features: [
        "TypeScript codebase",
        "Native navigation",
        "OTA updates",
        "Offline support",
        "Biometric auth",
        "CI/CD builds",
      ],
      description:
        "Native-quality apps for both stores from one React Native codebase",
      price: "$1699",
      priceDisplay: "$1699",
      delivery: "6-10 weeks",
      image: "/react-native.png",
    },
    {
      id: 103,
      slug: "flutter",
      title: "Flutter App Development",
      category: "Cross-Platform Apps",
      icon: SiFlutter,
      color: "#45d1fd",
      gradient: "from-blue-400 to-indigo-600",
      targetAudience: "Design-led brands, Retail, Fitness, Food",
      features: [
        "Pixel-perfect UI",
        "60fps animation",
        "Firebase backend",
        "Localisation",
        "Payments",
        "Store launch",
      ],
      description:
        "Fast, beautiful Flutter apps with identical UI on Android and iOS",
      price: "$1699",
      priceDisplay: "$1699",
      delivery: "6-10 weeks",
      image: "/flutter.png",
    },
    {
      id: 104,
      slug: "seo",
      title: "SEO Services",
      category: "Search & Growth",
      icon: FaSearchDollar,
      color: "#84cc16",
      gradient: "from-lime-500 to-green-600",
      targetAudience: "Any business that needs to be found on Google",
      features: [
        "Technical audit",
        "Keyword research",
        "On-page SEO",
        "Schema markup",
        "International SEO",
        "Monthly reports",
      ],
      description:
        "Technical, on-page and international SEO that moves pages onto page one",
      price: "$299/mo",
      priceDisplay: "$299/mo",
      delivery: "Ongoing",
      image: "/seo.png",
    },
    {
      id: 105,
      slug: "custom-software",
      title: "Custom Web Application",
      category: "MERN / Enterprise",
      icon: FaCogs,
      color: "#7c3aed",
      gradient: "from-violet-600 to-purple-700",
      targetAudience: "Operations teams, Enterprises, Marketplaces",
      features: [
        "Custom CRM / ERP",
        "Role-based access",
        "Dashboards",
        "API integrations",
        "Automation",
        "Full code handover",
      ],
      description:
        "Bespoke internal systems and portals built on the MERN stack",
      price: "$1999",
      priceDisplay: "$1999",
      delivery: "8-12 weeks",
      image: "/custom-software.png",
    },
    {
      id: 1,
      slug: "business",
      title: "Business / Company Website",
      category: "For Local Businesses & Startups",
      icon: FaBuilding,
      color: "#06b6d4",
      gradient: "from-cyan-500 to-blue-600",
      targetAudience: "Local businesses, Agencies, Startups",
      features: [
        "Home page",
        "About",
        "Services",
        "Contact form",
        "SEO Ready",
        "Mobile Responsive",
      ],
      description:
        "Establish your online presence and attract more customers globally",
      price: "$499",
      priceDisplay: "$499",
      delivery: "2-3 weeks",
      image: "/business.png",
    },
    {
      id: 2,
      slug: "ecommerce",
      title: "E-Commerce Website",
      category: "High Paying Category 💰",
      icon: FaShoppingCart,
      color: "#ec4899",
      gradient: "from-pink-500 to-rose-600",
      targetAudience: "Online stores, Product sellers",
      features: [
        "Product listing",
        "Cart system",
        "Payment gateway",
        "Order tracking",
        "Inventory management",
        "Wishlist",
      ],
      description:
        "Sell your products worldwide with a secure and scalable online store",
      price: "$999",
      priceDisplay: "$999",
      delivery: "4-6 weeks",
      image: "/ecommerce.png",
    },
    {
      id: 3,
      slug: "landing",
      title: "Landing Page",
      category: "Marketing Focused Site 🎯",
      icon: FaBullseye,
      color: "#f59e0b",
      gradient: "from-orange-500 to-red-600",
      targetAudience: "Ads campaigns, Product launches",
      features: [
        "Single page",
        "CTA buttons",
        "Lead form",
        "Analytics ready",
        "A/B testing",
        "Fast loading",
      ],
      description:
        "Convert visitors into paying customers with high-performing landing pages",
      price: "$199",
      priceDisplay: "$199",
      delivery: "1-2 weeks",
      image: "/landing-page.png",
    },
    {
      id: 4,
      slug: "portfolio",
      title: "Portfolio Website",
      category: "For Freelancers & Creatives",
      icon: FaUserAstronaut,
      color: "#8b5cf6",
      gradient: "from-purple-600 to-indigo-600",
      targetAudience: "Developers, Designers, Freelancers",
      features: [
        "Projects showcase",
        "Skills section",
        "Contact form",
        "Blog optional",
        "Resume/CV download",
        "Client testimonials",
      ],
      description:
        "Showcase your work professionally and attract global clients",
      price: "$349",
      priceDisplay: "$349",
      delivery: "2-3 weeks",
      image: "/portfolio.png",
    },
    {
      id: 5,
      slug: "blog",
      title: "Blog / Content Website",
      category: "SEO Based Income 📝",
      icon: FaBlog,
      color: "#10b981",
      gradient: "from-emerald-500 to-teal-600",
      targetAudience: "Bloggers, Content creators",
      features: [
        "Articles",
        "Categories",
        "Comments",
        "SEO optimized",
        "Email newsletter",
        "Social sharing",
      ],
      description:
        "Grow your audience and rank on Google with SEO-friendly blogs",
      price: "$299",
      priceDisplay: "$299",
      delivery: "2-3 weeks",
      image: "/blog.png",
    },
    {
      id: 6,
      slug: "booking",
      title: "Booking / Appointment Website",
      category: "High Demand Real-world Use Case 📅",
      icon: FaCalendarCheck,
      color: "#3b82f6",
      gradient: "from-blue-500 to-cyan-600",
      targetAudience: "Salons, Doctors, Coaches",
      features: [
        "Calendar",
        "Booking system",
        "Email/SMS confirmation",
        "Availability management",
        "Payment integration",
        "Automated reminders",
      ],
      description: "Allow customers to book appointments easily online",
      price: "$449",
      priceDisplay: "$449",
      delivery: "3-4 weeks",
      image: "/booking.png",
    },
    {
      id: 7,
      slug: "lms",
      title: "Education / LMS Website",
      category: "Trending Niche 🎓",
      icon: FaGraduationCap,
      color: "#14b8a6",
      gradient: "from-teal-500 to-emerald-600",
      targetAudience: "Coaching centers, Online teachers",
      features: [
        "Courses",
        "Video lessons",
        "Student dashboard",
        "Quiz system",
        "Certificate generation",
        "Progress tracking",
      ],
      description:
        "Create and sell online courses with a powerful learning platform",
      price: "$799",
      priceDisplay: "$799",
      delivery: "4-6 weeks",
      image: "/lms.png",
    },
    {
      id: 8,
      slug: "real-estate",
      title: "Real Estate Website",
      category: "Popular Among Foreign Clients 🏢",
      icon: FaHome,
      color: "#ef4444",
      gradient: "from-red-500 to-orange-600",
      targetAudience: "Property dealers, Real estate agents",
      features: [
        "Property listings",
        "Advanced filters",
        "Map integration",
        "Agent dashboard",
        "Virtual tours",
        "Mortgage calculator",
      ],
      description:
        "Showcase properties with advanced search and attract serious buyers",
      price: "$649",
      priceDisplay: "$649",
      delivery: "4-5 weeks",
      image: "/real-estate.png",
    },
    {
      id: 9,
      slug: "restaurant",
      title: "Restaurant / Food Website",
      category: "Easy + Fast Projects 🍔",
      icon: FaUtensils,
      color: "#f97316",
      gradient: "from-orange-500 to-amber-600",
      targetAudience: "Restaurants, Cafes, Food trucks",
      features: [
        "Menu display",
        "Online ordering",
        "Location map",
        "Reservation system",
        "Customer reviews",
        "Delivery integration",
      ],
      description: "Increase orders with a modern and mobile-friendly website",
      price: "$349",
      priceDisplay: "$349",
      delivery: "2-3 weeks",
      image: "/restaurant.png",
    },
    {
      id: 10,
      slug: "saas",
      title: "SaaS / Web App",
      category: "Premium Level (High Price) 💎",
      icon: FaCloud,
      color: "#a855f7",
      gradient: "from-purple-500 to-pink-600",
      targetAudience: "Startups, Entrepreneurs",
      features: [
        "Login/Signup",
        "User dashboard",
        "API integrations",
        "Subscription system",
        "Admin panel",
        "Analytics dashboard",
      ],
      description:
        "Build scalable web applications with secure backend systems",
      price: "$1499+",
      priceDisplay: "$1499+",
      delivery: "6-10 weeks",
      image: "/saas.png",
    },
    {
      id: 11,
      slug: "membership",
      title: "Membership Website",
      category: "Recurring Income Model 🔐",
      icon: FaUsers,
      color: "#06b6d4",
      gradient: "from-cyan-500 to-blue-600",
      targetAudience: "Content creators, Coaches",
      features: [
        "User login",
        "Paid access",
        "Subscription plans",
        "Member dashboard",
        "Content dripping",
        "Community forums",
      ],
      description: "Monetize your content with membership-based platforms",
      price: "$899",
      priceDisplay: "$899",
      delivery: "4-5 weeks",
      image: "/membership.png",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [services.length, paused]);

  const currentService = services[currentSlide];

  const accent = currentService.color || "#8b5cf6";
  const livePrice = priceFor(currentService.slug);
  const CurrentIcon = currentService.icon;

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <Stars />

      <div
        className="absolute -top-24 left-1/4 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 transition-colors duration-700"
        style={{ background: accent }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm mb-4">
            <FaRocket className="w-3 h-3 text-purple-400" />
            <span className="text-xs font-semibold tracking-wider text-purple-300 uppercase">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-linear-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Under One Roof
            </span>
          </h2>
          <p className="text-gray-400 text-base mt-4 max-w-2xl mx-auto">
            From simple landing pages to complex web applications — we build it
            all
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Service list: a swipeable row on phones, a column on desktop */}
          <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {services.map((s, i) => {
              const ItemIcon = s.icon;
              const active = i === currentSlide;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-current={active}
                  className={`group flex shrink-0 snap-start items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 lg:w-full ${
                    active
                      ? "border-white/20 bg-white/10"
                      : "border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
                  }`}
                  style={active ? { boxShadow: `0 12px 30px -14px ${s.color}` } : undefined}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: s.color }}
                  >
                    {ItemIcon && <ItemIcon className="text-base text-white" />}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-sm font-semibold ${
                        active ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="block truncate text-[11px] text-gray-500">
                      {s.category}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stage */}
          <div
            className="relative min-h-[540px] overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col p-6 md:p-10"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(120% 90% at 100% 0%, ${accent}66, transparent 60%), radial-gradient(90% 80% at 0% 100%, ${accent}40, transparent 55%)`,
                  }}
                />
                {CurrentIcon && (
                  <CurrentIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-10 -right-8 text-[240px] text-white/[0.06]"
                  />
                )}

                <div className="relative flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    {currentService.category}
                  </span>
                  <span className="text-xs tabular-nums text-white/50">
                    {String(currentSlide + 1).padStart(2, "0")} /{" "}
                    {String(services.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-6 text-3xl font-bold leading-tight text-white md:text-4xl">
                  {currentService.title}
                </h3>
                <p className="relative mt-3 max-w-xl text-base leading-relaxed text-gray-200">
                  {currentService.description}
                </p>

                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {currentService.features.slice(0, 6).map((feature) => (
                    <li
                      key={feature}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      <FiCheck className="shrink-0" style={{ color: accent }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="relative mt-6 text-sm text-gray-300">
                  <span className="mr-2 text-[11px] uppercase tracking-wider text-gray-400">
                    Built for
                  </span>
                  <span className="font-medium text-white">
                    {currentService.targetAudience}
                  </span>
                </p>

                <div className="relative mt-auto grid max-w-md grid-cols-2 gap-3 pt-8">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                      Starting from
                    </p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {livePrice?.price ?? currentService.price}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                      Delivery
                    </p>
                    <p className="mt-1 text-xl font-bold" style={{ color: accent }}>
                      {livePrice?.delivery ?? currentService.delivery}
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                    style={{ background: `linear-gradient(120deg, ${accent}, #ec4899)` }}
                  >
                    Get This Website <FiArrowRight />
                  </Link>
                  <Link
                    href={`/services/${currentService.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <FiInfo /> Learn More
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
              <motion.div
                key={`${currentSlide}-${paused}`}
                className="h-full"
                style={{ background: accent }}
                initial={{ width: "0%" }}
                animate={{ width: paused ? undefined : "100%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous service"
            onClick={() => setCurrentSlide((p) => (p - 1 + services.length) % services.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 hover:bg-white/10"
          >
            <FiArrowRight className="rotate-180" />
          </button>
          <div className="flex gap-2">
            {services.map((s, idx) => (
              <button
                key={s.slug}
                type="button"
                aria-label={`Show ${s.title}`}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                style={currentSlide === idx ? { background: s.color } : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next service"
            onClick={() => setCurrentSlide((p) => (p + 1) % services.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 hover:bg-white/10"
          >
            <FiArrowRight />
          </button>
        </div>

        <div className="mt-10 text-center">
          <Link href="/services" className="text-sm font-semibold text-purple-300 hover:text-purple-200">
            View all {services.length} services →
          </Link>
        </div>
      </div>
    </section>
  );
}
