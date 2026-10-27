"use client";

import Link from "next/link";
import { Stars } from "./Stars";
import { useState, useEffect } from "react";
import Icon from "./Icon";

export default function HeroSection() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // What the company actually builds — cycled in the hero headline.
  const deliverables = [
    "Business Websites",
    "E-Commerce Stores",
    "React Native Apps",
    "Flutter Apps",
    "SaaS Platforms",
    "SEO Campaigns",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const current = deliverables[index];

      if (isDeleting) {
        setText(current.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % deliverables.length);
        }
      } else {
        setText(current.substring(0, text.length + 1));
        if (text.length === current.length) {
          setTimeout(() => setIsDeleting(true), 1400);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 45 : 90);
    return () => clearTimeout(timer);
  }, [text, index, isDeleting]);

  // Promises we actually control — no invented project or client counts.
  const trustPoints = [
    { icon: "fa-file-signature", text: "Fixed quote before work starts" },
    { icon: "fa-code-branch", text: "You own the source code" },
    { icon: "fa-reply", text: "Reply within one working day" },
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-purple-900/30 to-black animate-gradient" />
      <div className="absolute inset-0 bg-linear-to-t from-purple-950/20 via-transparent to-black/30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, var(--hero-glow) 0%, transparent 70%)",
        }}
      />

      <Stars />

      {/* Bottom Circular Design */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="relative w-full h-20">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[200%] h-20 rounded-t-full bg-linear-to-t from-purple-600/15 via-purple-600/5 to-transparent blur-xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[140%] h-16 rounded-t-full border-t border-purple-500/30 animate-spin-slow" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[180%] h-20 rounded-t-full border-t border-dashed border-purple-500/20 animate-spin-slow-reverse" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          {/* LEFT - Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-600/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-purple-500/30 animate-fadeIn">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-white/90 font-medium">
                Accepting new projects · Worldwide delivery
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2rem] sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] animate-slideUp">
              <span className="text-white">We build </span>
              <span className="bg-linear-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                websites &amp; mobile apps
              </span>
              <br />
              <span className="text-white">for businesses in every country</span>
            </h1>

            {/* Typing line */}
            <div className="space-y-3 animate-slideUp delay-200">
              <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                <span className="text-gray-400 text-sm">We deliver:</span>
                <div className="bg-purple-600/20 backdrop-blur-sm px-3 py-1 rounded-md border border-purple-500/20 min-w-[160px] text-left">
                  <span className="text-purple-200 text-sm font-mono">
                    {text}
                  </span>
                  <span className="text-purple-400 animate-pulse ml-0.5">|</span>
                </div>
              </div>

              <p className="text-gray-300 text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Unique Web Layer is a remote-first development company. One team
                designs, builds and ranks your product — websites on{" "}
                <span className="text-purple-300">Next.js and MERN</span>, apps
                on{" "}
                <span className="text-purple-300">
                  React Native and Flutter
                </span>
                , and the SEO that puts them in front of customers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-slideUp delay-300">
              <Link href="/contact">
                <button className="group relative px-7 py-3 rounded-full text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-purple-800 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25 overflow-hidden w-full sm:w-auto">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Icon name="fa-paper-plane" className="text-xs" />
                    Get a Free Quote
                  </span>
                  <span className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </Link>

              <Link href="/portfolio">
                <button className="px-7 py-3 rounded-full text-sm font-semibold text-white border border-purple-400/50 hover:border-purple-400 hover:bg-purple-600/10 hover:scale-105 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2">
                  <Icon name="fa-folder-open" className="text-xs" />
                  See Our Work
                </button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start pt-2 animate-slideUp delay-500">
              {trustPoints.map((t) => (
                <div
                  key={t.text}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  <Icon name={t.icon} className="text-purple-400" />
                  {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Hero illustration */}
          <div className="relative">
            {/* Glow behind the artwork */}
            <div className="absolute -inset-6 bg-linear-to-tr from-purple-600/25 via-transparent to-pink-600/20 blur-3xl rounded-full" />

            <div className="relative animate-float-slow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-build.svg"
                alt="A laptop showing an analytics dashboard with a mobile app screen in front of it"
                width={640}
                height={560}
                fetchPriority="high"
                className="w-full h-auto max-w-[560px] mx-auto drop-shadow-2xl"
              />
            </div>

            {/* Floating tech chips */}
            <div className="absolute top-2 -left-1 bg-black/70 backdrop-blur-sm border border-purple-500/30 rounded-xl px-3 py-1.5 animate-float hidden sm:block">
              <span className="text-[11px] font-mono text-purple-300">
                Next.js
              </span>
            </div>
            <div className="absolute bottom-6 -right-1 bg-black/70 backdrop-blur-sm border border-purple-500/30 rounded-xl px-3 py-1.5 animate-float-delay hidden sm:block">
              <span className="text-[11px] font-mono text-cyan-300">
                React Native
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin-slow {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }
        @keyframes spin-slow-reverse {
          from {
            transform: translateX(-50%) rotate(360deg);
          }
          to {
            transform: translateX(-50%) rotate(0deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 18s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 3s ease-in-out infinite 1.5s;
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delay,
          .animate-float-slow {
            animation: none;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .delay-200 {
          animation-delay: 0.15s;
        }
        .delay-300 {
          animation-delay: 0.25s;
        }
        .delay-500 {
          animation-delay: 0.35s;
        }
      `}</style>
    </section>
  );
}
