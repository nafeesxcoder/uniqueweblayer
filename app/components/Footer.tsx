"use client";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdLocationOn, MdEmail, MdAccessTime, MdPhone } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

import { services as allServices } from "../data/services";
import { company } from "../data/site";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "Industries", href: "/industries" },
    { name: "Our Process", href: "/process" },
    { name: "Technologies", href: "/technologies" },
    { name: "Countries We Serve", href: "/web-development-company" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ],
};

// All services (from the central catalogue)
const services = allServices.map((s) => ({
  name: s.name,
  path: `/services/${s.slug}`,
  icon: s.icon,
  color: s.color,
}));

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="custom-scrollbar">{children}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function Footer() {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsConditionsOpen, setIsTermsConditionsOpen] = useState(false);

  return (
    <footer className="relative bg-black/95 backdrop-blur-sm mt-20">
      {/* Distinct Top Border - Purple Gradient Line */}
      <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-purple-500 to-transparent" />

      {/* Top Purple Glow Effect */}
      <div className="absolute -top-4 left-0 right-0 h-8 bg-linear-to-b from-purple-500/20 to-transparent blur-md pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info - With Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="block mb-6">
              <BrandLogo className="w-auto h-12 object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              A remote-first web and mobile app development company. We build
              websites, Android and iOS apps and custom software for businesses
              worldwide — and run the SEO that gets them found.
            </p>

            {/* Social Links — URLs come from company.social in data/site.ts.
                A platform left as "" there renders a muted, unlinked icon. */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: FaGithub, href: company.social.github, label: "GitHub" },
                { icon: FaLinkedinIn, href: company.social.linkedin, label: "LinkedIn" },
                { icon: FaYoutube, href: company.social.youtube, label: "YouTube" },
                { icon: FaFacebookF, href: company.social.facebook, label: "Facebook" },
                { icon: FaTwitter, href: company.social.twitter, label: "Twitter" },
                { icon: FaInstagram, href: company.social.instagram, label: "Instagram" },
              ].map(({ icon: Icon, href, label }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${company.name} on ${label}`}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-500/10 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ) : (
                  <span
                    key={label}
                    title={`${label} — coming soon`}
                    aria-label={`${label} profile coming soon`}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-600 cursor-default"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                ),
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 mt-6">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-purple-500 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services - Simple List with Scroll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scroll mt-6">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.path}
                    className="text-gray-400 hover:text-purple-500 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span
                      className="shrink-0 transition-colors"
                      style={{ color: service.color }}
                    >
                      <Icon name={service.icon} className="text-xs" />
                    </span>
                    <span className="group-hover:text-purple-500 transition-colors">
                      {service.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <MdEmail className="w-4 h-4 text-purple-500" />
                </div>
                <a
                  href={`mailto:${company.email}`}
                  className="hover:text-purple-500 transition-colors break-all"
                >
                  <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                    General enquiries
                  </span>
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <MdEmail className="w-4 h-4 text-purple-500" />
                </div>
                <a
                  href={`mailto:${company.emailSales}`}
                  className="hover:text-purple-500 transition-colors break-all"
                >
                  <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                    Projects &amp; quotes
                  </span>
                  {company.emailSales}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <MdPhone className="w-4 h-4 text-purple-500" />
                </div>
                <a
                  href="tel:+917409233994"
                  className="hover:text-purple-500 transition-colors"
                >
                  +91 (740) 923-3994
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <MdLocationOn className="w-4 h-4 text-purple-500" />
                </div>
                <span>
                  <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                    Where we work
                  </span>
                  Remote-first team based in {company.basedIn.countryName} —
                  projects delivered online for clients in any country
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <MdAccessTime className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
                  <p>Sat - Sun: Available for meetings</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Unique Web Layer. All rights
              reserved.
              {/*
                Your own way in. Quiet and on the left, away from the floating
                WhatsApp button that sits over the bottom-right corner. The page
                itself asks for the password, so a stranger clicking it gets
                nowhere — and nofollow keeps it out of search results.
              */}
              <Link
                href="/admin"
                rel="nofollow"
                className="ml-3 text-gray-600 hover:text-purple-500 transition-colors"
              >
                Admin
              </Link>
            </p>

            <div className="flex gap-6">
              {/*
                One quiet crawl path to the country landing pages. The country
                list itself is SEO-only now — it is not shown anywhere on the
                site — but without a single internal link those pages become
                orphans that search engines rarely re-crawl.
              */}
              <Link
                href="/web-development-company"
                className="text-gray-500 hover:text-purple-500 transition-colors text-sm"
              >
                Global Coverage
              </Link>
              <button
                onClick={() => setIsTermsConditionsOpen(true)}
                className="text-gray-500 hover:text-purple-500 transition-colors text-sm"
              >
                Terms & Conditions
              </button>
              <button
                onClick={() => setIsPrivacyPolicyOpen(true)}
                className="text-gray-500 hover:text-purple-500 transition-colors text-sm"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
        title="Privacy Policy"
      >
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Privacy Policy
          </h3>
          <p>
            Your privacy is important to us. This privacy policy explains how we
            collect, use, and protect your personal information.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            1. Information We Collect
          </h4>
          <p>
            We may collect personal information such as your name, email
            address, and project details when you contact us through the
            website.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            2. How We Use Your Information
          </h4>
          <p>
            We use your information to respond to inquiries, provide services,
            and improve our website.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            3. Data Security
          </h4>
          <p>
            We take reasonable measures to protect your personal information
            from unauthorized access.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            4. Contact Us
          </h4>
          <p>
            If you have questions about this policy, please contact us at{" "}
            {company.email}
          </p>
          <p className="text-gray-500 text-xs">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        isOpen={isTermsConditionsOpen}
        onClose={() => setIsTermsConditionsOpen(false)}
        title="Terms & Conditions"
      >
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Terms & Conditions
          </h3>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            1. Acceptance of Terms
          </h4>
          <p>By using our services, you agree to these terms and conditions.</p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            2. Services
          </h4>
          <p>
            We provide web development and related services as agreed upon in
            our contract.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            3. Payment Terms
          </h4>
          <p>
            Payment terms are specified in the project agreement. A deposit may
            be required before work begins.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            4. Project Timeline
          </h4>
          <p>
            Project timelines are estimates and may be adjusted based on project
            requirements and feedback.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            5. Intellectual Property
          </h4>
          <p>
            Upon full payment, the client owns the final deliverables. We retain
            the right to showcase the work in our portfolio.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            6. Limitation of Liability
          </h4>
          <p>
            We are not liable for any indirect damages arising from the use of
            our services.
          </p>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            7. Governing Law
          </h4>
          <p>These terms are governed by the laws of India.</p>
          <p className="text-gray-500 text-xs">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </Modal>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #751f8c, #b665f2);
          border-radius: 10px;
        }
      `}</style>
    </footer>
  );
}
