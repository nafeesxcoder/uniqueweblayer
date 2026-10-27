"use client";

import { company } from "../data/site";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa";

/**
 * Every URL comes from `company.social` in data/site.ts — one place to edit.
 * A platform left as "" there still shows its icon, just not as a link, so
 * adding the real URL later turns it into one with no code change.
 */
const SOCIALS = [
  {
    icon: FaInstagram,
    href: company.social.instagram,
    label: "Instagram",
    color: "hover:text-[#e4405f]",
  },
  {
    icon: FaYoutube,
    href: company.social.youtube,
    label: "YouTube",
    color: "hover:text-[#ff0000]",
  },
  {
    icon: FaFacebookF,
    href: company.social.facebook,
    label: "Facebook",
    color: "hover:text-[#1877f2]",
  },
  {
    icon: FaTwitter,
    href: company.social.twitter,
    label: "Twitter",
    color: "hover:text-[#1da1f2]",
  },
  {
    icon: FaLinkedinIn,
    href: company.social.linkedin,
    label: "LinkedIn",
    color: "hover:text-[#0077b5]",
  },
];

export default function TopContactBar() {
  return (
    <div className="uwl-onbrand w-full bg-linear-to-r from-[#751f8c] via-[#9333ea] to-[#751f8c] text-white py-2.5 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs sm:text-sm">
          {/* Left - contact details */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-purple-200"
              title="General enquiries"
            >
              <FaEnvelope className="w-3.5 h-3.5" />
              <span>{company.email}</span>
            </a>

            <span className="hidden text-white/40 sm:inline">|</span>

            <a
              href={`mailto:${company.emailSales}`}
              className="flex items-center gap-1.5 transition-colors hover:text-purple-200"
              title="Projects & quotes"
            >
              <FaEnvelope className="w-3.5 h-3.5" />
              <span>{company.emailSales}</span>
            </a>

            <span className="hidden text-white/40 sm:inline">|</span>

            <a
              href={`tel:${company.phone}`}
              className="flex items-center gap-1.5 transition-colors hover:text-purple-200"
            >
              <FaPhoneAlt className="w-3.5 h-3.5" />
              <span>🇮🇳 {company.phoneDisplay}</span>
            </a>
          </div>

          {/* Right - follow us */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium tracking-wider text-white/80">
              FOLLOW US
            </span>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label, color }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white/90 transition-all duration-300 hover:scale-110 hover:text-white ${color}`}
                    aria-label={label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  /* No URL set yet — show the icon, but do not link nowhere. */
                  <span
                    key={label}
                    className="cursor-default text-white/45"
                    title={`${label} — coming soon`}
                    aria-label={`${label} profile coming soon`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
