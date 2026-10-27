import Script from "next/script";
import HeroSection from "./components/HeroSection";
import StatsBar from "./components/StatsBar";
import ProjectsSection from "./components/ProjectsSection";
import ServicesSection from "./components/ServicesSection";
import ProcessSection from "./components/ProcessSection";
import IndustriesSection from "./components/IndustriesSection";
import WhyChooseUs from "./components/WhyChooseUs";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import ContactClient from "./contact/ContactClient";
import faqData from "./data/faq.json";
import { faqSchema, jsonLd } from "./lib/seo";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* FAQ rich result for the home page */}
      <Script
        id="home-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(faqData.faqs.slice(0, 8)))}
      />

      {/* Hero */}
      <HeroSection />

      {/* Trust indicators */}
      <StatsBar />

      {/* What we build */}
      <ServicesSection />

      {/* Selected work */}
      <ProjectsSection />

      {/* How we deliver */}
      <ProcessSection />

      {/* Industries */}
      <IndustriesSection />

      {/* Why us */}
      <WhyChooseUs />

      {/* About the company */}
      <About />

      {/* Client feedback */}
      <Testimonials />

      {/* Contact */}
      <ContactClient />
    </main>
  );
}
