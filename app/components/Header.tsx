"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaTimes, FaRocket } from "react-icons/fa";
import {
  services as allServices,
  serviceCategories,
} from "../data/services";
import ThemeToggle from "./ThemeToggle";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Industries", path: "/industries" },
    { name: "Process", path: "/process" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const services = allServices.map((s) => ({
    name: s.name,
    path: `/services/${s.slug}`,
    category: s.category,
    icon: s.icon,
  }));

  return (
    <>
      {/* Fixed Header - Mobile: top-0, Desktop: top-8 */}
      <header
        className={`fixed top-0 md:top-8 left-0 w-full z-40 transition-all duration-500 ${
          scrolled
            ? "bg-black/95 backdrop-blur-xl py-3 shadow-2xl shadow-purple-900/20"
            : "bg-black/80 backdrop-blur-md py-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* LEFT SIDE - Logo + Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group relative flex items-center z-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <BrandLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative text-sm font-medium transition-all duration-300 ${
                    pathname === item.path
                      ? "text-[#b665f2]"
                      : "text-gray-300 hover:text-[#b665f2]"
                  }`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-[#751f8c] to-[#b665f2] rounded-full"></span>
                  )}
                </Link>
              ))}

              {/* SERVICES DROPDOWN - Desktop */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  className={`text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                    pathname.includes("/services")
                      ? "text-[#b665f2]"
                      : "text-gray-300 hover:text-[#b665f2]"
                  }`}
                >
                  Services
                  <FaChevronDown
                    className={`text-xs transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isServicesOpen && (
                  <div
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(90vw,920px)] bg-black/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl p-5 z-50"
                  >
                    <div className="grid grid-cols-3 gap-5">
                      {serviceCategories.map((cat) => (
                        <div key={cat}>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-2 pb-2 border-b border-white/10">
                            {cat}
                          </div>
                          <div className="space-y-0.5 max-h-80 overflow-y-auto custom-scroll pr-1">
                            {services
                              .filter((s) => s.category === cat)
                              .map((s) => (
                                <Link
                                  key={s.path}
                                  href={s.path}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] text-gray-300 hover:text-[#b665f2] hover:bg-white/5 transition-all duration-200"
                                  onClick={() => setIsServicesOpen(false)}
                                >
                                  <Icon name={s.icon} className="text-[11px] text-purple-500/70 w-3.5" />
                                  {s.name}
                                </Link>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <Link
                        href="/services"
                        className="text-sm text-purple-400 hover:text-purple-300 font-semibold"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <Icon name="fa-grid-2" className="mr-2" />All {services.length}{" "}
                        services
                      </Link>
                      <Link
                        href="/web-development-company"
                        className="text-xs text-gray-400 hover:text-purple-300"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <Icon name="fa-earth-americas" className="mr-1.5" />
                        Countries we serve
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Only Hire Me Button */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden md:flex" />

            <Link href="/contact" className="hidden md:block">
              <button className="group relative px-5 py-2 bg-linear-to-r from-[#751f8c] to-[#b665f2] rounded-full text-white text-sm font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  <FaRocket className="text-xs" />
                  Get a Quote
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-[#b665f2] to-[#751f8c] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden relative w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="relative w-5 h-5">
              <span className="absolute h-0.5 bg-white rounded-full top-1 w-5"></span>
              <span className="absolute h-0.5 bg-white rounded-full top-2 w-5"></span>
              <span className="absolute h-0.5 bg-white rounded-full top-3 w-5"></span>
            </div>
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 w-[85%] max-w-sm h-screen bg-black/95 backdrop-blur-xl z-[200] transform transition-transform duration-300 ease-out shadow-2xl md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-white/10 sticky top-0 bg-black/95 z-10">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <BrandLogo className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <FaTimes className="text-white text-sm" />
            </button>
          </div>
        </div>

        <div className="h-full overflow-y-auto pb-32">
          <div className="p-5 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                  pathname === item.path
                    ? "bg-linear-to-r from-[#751f8c]/20 to-[#b665f2]/20 text-[#b665f2] border border-purple-500/30"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}

            {/* Mobile Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                  pathname.includes("/services")
                    ? "bg-linear-to-r from-[#751f8c]/20 to-[#b665f2]/20 text-[#b665f2] border border-purple-500/30"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <span className="font-medium">Services</span>
                <FaChevronDown
                  className={`text-xs transition-transform duration-300 ${isMobileServicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isMobileServicesOpen && (
                <div className="ml-4 mt-2 space-y-1 border-l border-purple-500/30 pl-3 max-h-64 overflow-y-auto">
                  <Link
                    href="/services"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                    className="block px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300 hover:bg-white/5 transition-all duration-300 font-semibold"
                  >
                    <Icon name="fa-grid-2" className="mr-2" /> All Services (
                    {services.length})
                  </Link>

                  {serviceCategories.map((cat) => (
                    <div key={cat} className="pt-2">
                      <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-purple-500/80">
                        {cat}
                      </div>
                      {services
                        .filter((s) => s.category === cat)
                        .map((s) => (
                          <Link
                            key={s.path}
                            href={s.path}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsMobileServicesOpen(false);
                            }}
                            className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-[#b665f2] hover:bg-white/5 transition-all duration-300"
                          >
                            {s.name}
                          </Link>
                        ))}
                    </div>
                  ))}

                  <Link
                    href="/web-development-company"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                    className="block px-3 py-2 mt-2 rounded-lg text-sm text-gray-400 hover:text-[#b665f2] hover:bg-white/5 transition-all duration-300 border-t border-white/10"
                  >
                    <Icon name="fa-earth-americas" className="mr-2" />Countries we
                    serve
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section - Hire Me Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent pt-6">
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full py-3 bg-linear-to-r from-[#751f8c] to-[#b665f2] rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2">
                <FaRocket className="text-xs" /> Get a Quote
              </button>
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[199] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

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
    </>
  );
}
