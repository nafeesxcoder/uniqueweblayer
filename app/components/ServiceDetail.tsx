"use client";

import { Stars } from "./Stars";
import Link from "next/link";
import { useState, useEffect } from "react";
import Icon from "./Icon";

interface ServiceDetailProps {
  title: string;
  category: string;
  icon: string;
  color: string;
  gradient: string;
  targetAudience: string[];
  features: string[];
  description: string;
  longDescription: string;
  price: string;
  delivery: string;
  benefits: string[];
  process: string[];
  technologies: string[];
  /** Optional FAQ block — also feeds the FAQ rich result on the page. */
  faqs?: { question: string; answer: string }[];
}

export default function ServiceDetail({
  title,
  category,
  icon,
  color,
  gradient,
  targetAudience,
  features,
  description,
  longDescription,
  price,
  delivery,
  benefits,
  process,
  technologies,
  faqs,
}: ServiceDetailProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <Stars />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-purple-500/20">
            {/* ✅ Fixed: Font Awesome icon with proper classes */}
            <Icon name={icon} className="text-purple-400 text-sm" />
            <span className="text-sm font-medium text-purple-300">
              {category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left side - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="fa-info-circle" className="text-purple-400" />
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">{longDescription}</p>
            </div>

            {/* Features */}
            <div className="bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="fa-list-check" className="text-purple-400" />
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="shrink-0" style={{ color }}>
                      <Icon name="fa-check-circle" className="text-sm mt-0.5" />
                    </span>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div className="bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="fa-chart-line" className="text-purple-400" />
                Development Process
              </h2>
              <div className="space-y-4">
                {process.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-linear-to-r ${gradient} flex items-center justify-center shrink-0`}
                    >
                      <span className="text-white text-sm font-bold">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="fa-microchip" className="text-purple-400" />
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-linear-to-br from-purple-900/40 to-black/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 sticky top-24">
              <div className="text-center mb-6">
                {/* ✅ Fixed: Large icon in price card */}
                <div
                  className={`w-20 h-20 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon name={icon} className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="text-gray-400 text-sm mt-1">{category}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400 text-sm">Starting Price</span>
                  <span className="text-2xl font-bold text-white">{price}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400 text-sm">Delivery Time</span>
                  <span className="text-white font-semibold">{delivery}</span>
                </div>
              </div>

              <Link href="/contact">
                <button className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-purple-800 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                  Get This Service
                </button>
              </Link>
            </div>

            {/* Target Audience */}
            <div className="bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Icon name="fa-users" className="text-purple-400" />
                Perfect For
              </h3>
              <div className="space-y-2">
                {targetAudience.map((audience, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="shrink-0" style={{ color }}>
                      <Icon name="fa-check-circle" className="text-xs" />
                    </span>
                    <span className="text-gray-300 text-sm">{audience}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Icon name="fa-gem" className="text-purple-400" />
                Key Benefits
              </h3>
              <div className="space-y-2">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span style={{ color }}>
                      <Icon name="fa-star" className="text-xs" />
                    </span>
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Worldwide delivery */}
            <div className="bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Icon name="fa-earth-americas" className="text-purple-400" />
                Available Worldwide
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This service is delivered online to clients in every country.
                Pricing in USD, GBP, EUR, AED, CAD, AUD or INR, contracts and
                NDAs in English, and meetings scheduled in your time zone.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {[
                  "USA",
                  "UK",
                  "Canada",
                  "Australia",
                  "UAE",
                  "Germany",
                  "Singapore",
                  "India",
                ].map((c) => (
                  <span
                    key={c}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <div className="mt-12 bg-linear-to-br from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="fa-circle-question" className="text-purple-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-white/10 bg-white/3 p-4 open:border-purple-500/40 transition-colors"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-white font-medium text-sm md:text-base">
                    {faq.question}
                    <Icon name="fa-chevron-down" className="text-purple-400 text-xs mt-1 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-900/25 to-black/40 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to start your {title.toLowerCase()} project?
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Send us the requirements and you get a fixed quote, a scope document
            and a delivery date — usually within one working day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <Link href="/contact">
              <button className="px-7 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:scale-105 transition-transform w-full sm:w-auto">
                Get a Free Quote
              </button>
            </Link>
            <Link href="/portfolio">
              <button className="px-7 py-3 rounded-full border border-purple-400/50 text-white text-sm font-semibold hover:bg-purple-600/10 transition-colors w-full sm:w-auto">
                See Our Work
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
