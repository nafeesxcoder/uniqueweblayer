"use client";

import { useState } from "react";
import { Stars } from "../components/Stars";
import { trackEvent } from "../components/Analytics";
import { readVisitSource } from "../components/VisitSource";
import { services, serviceCategories } from "../data/services";
import { company } from "../data/site";
import { submitContactForm } from "../lib/api";
import { FaWhatsapp, FaReact, FaNodeJs } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiMysql,
} from "react-icons/si";
import {
  FiArrowRight,
  FiCheck,
  FiMail,
  FiMessageSquare,
  FiFileText,
  FiPhone,
  FiLock,
} from "react-icons/fi";

const BUDGET_OPTIONS = [
  "Under $500",
  "$500 - $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000+",
  "Not sure yet",
];

const NEXT_STEPS = [
  {
    icon: FiMail,
    title: "We reply within one working day",
    body: "A real person reads it — not an autoresponder loop. If we are not the right fit, we say so instead of booking a call.",
  },
  {
    icon: FiMessageSquare,
    title: "A short call to pin down scope",
    body: "Twenty minutes on what the product has to do, who uses it and what already exists. No deck, no pitch.",
  },
  {
    icon: FiFileText,
    title: "A written quote and a date",
    body: "Fixed price, feature list and delivery date in a document you keep. Change requests are quoted separately, never billed quietly.",
  },
];

const QUOTE_INCLUDES = [
  "A fixed price, not an hourly estimate",
  "A delivery date with weekly checkpoints",
  "A feature list, so scope is not arguable later",
  "Full source code and repository access at handover",
];

const STACK = [
  { icon: SiNextdotjs, name: "Next.js", color: "#ffffff" },
  { icon: FaReact, name: "React Native", color: "#61dafb" },
  { icon: FaNodeJs, name: "Node.js", color: "#68a063" },
  { icon: SiMysql, name: "MySQL", color: "#4479a1" },
  { icon: SiTypescript, name: "TypeScript", color: "#3178c6" },
  { icon: SiTailwindcss, name: "Tailwind", color: "#38bdf8" },
];

export default function ContactClient({
  asPageHeading = false,
}: {
  asPageHeading?: boolean;
}) {
  const Heading = asPageHeading ? "h1" : "h2";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    service: "",
    budget: "",
    message: "",
    website: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceGroups = serviceCategories.map((category) => ({
    label: category,
    options: services.filter((s) => s.category === category).map((s) => s.name),
  }));

  const validateForm = () => {
    const next: Record<string, string> = {};

    if (!formData.name.trim()) next.name = "Please enter your name";

    const digits = formData.mobile.replace(/[^\d]/g, "");
    if (!formData.mobile.trim()) next.mobile = "Phone number is required";
    else if (digits.length < 7 || digits.length > 15)
      next.mobile = "Enter a reachable number with country code";

    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email))
      next.email = "Enter a valid email address";

    if (!formData.service) next.service = "Please choose a service";

    if (!formData.message.trim()) next.message = "Tell us about the project";
    else if (formData.message.trim().length < 10)
      next.message = "A sentence or two helps us quote accurately";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await submitContactForm({ ...formData, ...readVisitSource() });
      setSubmitStatus("success");

      trackEvent("generate_lead", {
        service: formData.service,
        budget: formData.budget || "not specified",
      });
      setErrorMessage("");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        service: "",
        budget: "",
        message: "",
        website: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not send the message. Please email us instead.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (name: string) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-gray-500 transition-colors focus:outline-none ${
      errors[name]
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/10 focus:border-purple-500"
    }`;

  const labelClass = "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20">
      <div className="absolute inset-0 bg-linear-to-b from-black via-purple-950/10 to-black" />
      <Stars />
      <div className="absolute top-24 left-8 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="absolute bottom-24 right-8 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-600/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-purple-200">
              Accepting new projects
            </span>
          </div>

          <Heading className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">
            <span className="text-white">Tell us what you are </span>
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              building
            </span>
          </Heading>

          <p className="mt-4 text-base leading-relaxed text-gray-400">
            Send the details below and you get a scope, a fixed price and a
            delivery date in writing — usually within one working day.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:gap-12">
          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-black/40 p-6 backdrop-blur-sm">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-purple-300">
                What happens next
              </h3>

              <ol className="relative space-y-6">
                <span
                  aria-hidden="true"
                  className="absolute left-4.5 top-3 bottom-3 w-px bg-linear-to-b from-purple-500/50 via-purple-500/25 to-transparent"
                />
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4">
                    <div className="uwl-panel relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border">
                      <step.icon className="h-4 w-4 text-purple-300" />
                    </div>
                    <div className="pt-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[11px] text-purple-400/70">
                          0{i + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {step.title}
                        </h4>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-gray-400">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
                What the quote includes
              </h3>
              <ul className="space-y-2.5">
                {QUOTE_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-[13px] leading-relaxed text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
                Rather not use a form?
              </h3>

              <div className="space-y-3">
                <a
                  href={`mailto:${company.email}`}
                  className="group flex items-start gap-3 text-sm text-gray-300 transition-colors hover:text-purple-300"
                >
                  <FiMail className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                      General enquiries
                    </span>
                    {company.email}
                  </span>
                </a>

                <a
                  href={`mailto:${company.emailSales}`}
                  className="group flex items-start gap-3 text-sm text-gray-300 transition-colors hover:text-purple-300"
                >
                  <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                      Projects &amp; quotes
                    </span>
                    {company.emailSales}
                  </span>
                </a>

                <a
                  href={`tel:${company.phone}`}
                  className="group flex items-start gap-3 text-sm text-gray-300 transition-colors hover:text-purple-300"
                >
                  <FiPhone className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                      Phone
                    </span>
                    {company.phoneDisplay}
                  </span>
                </a>

                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-gray-300 transition-colors hover:text-green-400"
                >
                  <FaWhatsapp className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                      WhatsApp
                    </span>
                    Message us directly
                  </span>
                </a>
              </div>

              <p className="mt-4 border-t border-white/10 pt-4 text-[12px] leading-relaxed text-gray-500">
                {company.hours}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Usually built with
              </h3>
              <div className="flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5"
                  >
                    <tech.icon
                      className="text-sm"
                      style={{ color: tech.color }}
                    />
                    <span className="text-xs text-gray-400">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-linear-to-r from-purple-500/15 to-pink-500/15 blur-2xl" />

            <div className="uwl-panel relative rounded-2xl border p-6 shadow-2xl sm:p-8">
              {submitStatus === "success" ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                    <FiCheck className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Got it — your enquiry is in
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
                    We have sent a confirmation to your inbox. Someone will
                    reply within one working day with next steps. If it is
                    urgent, message us on WhatsApp.
                  </p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href={`https://wa.me/${company.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-500/40 px-5 py-2.5 text-sm font-medium text-green-400 transition hover:bg-green-500/10"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      WhatsApp us
                    </a>
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
                    >
                      Send another
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Project details
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Four fields are required. The rest helps us quote more
                      accurately.
                    </p>
                  </div>

                  {submitStatus === "error" && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                      <p className="text-sm font-medium text-red-300">
                        {errorMessage || "Something went wrong."}
                      </p>
                      <p className="mt-1.5 text-xs text-red-300/70">
                        You can email us directly at {company.email}
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    <div aria-hidden="true" className="hidden">
                      <label htmlFor="website">Leave this field empty</label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Your name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          autoComplete="name"
                          placeholder="Nafees Ahmad"
                          className={fieldClass("name")}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-400">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          placeholder="you@company.com"
                          className={fieldClass("email")}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-400">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mobile" className={labelClass}>
                        Phone or WhatsApp *
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        autoComplete="tel"
                        placeholder="+1 555 014 2290"
                        className={fieldClass("mobile")}
                      />
                      {errors.mobile ? (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.mobile}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">
                          Include your country code
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="service" className={labelClass}>
                          What do you need? *
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className={`uwl-select w-full rounded-xl border px-4 py-3 focus:outline-none ${
                            errors.service
                              ? "border-red-500/60 focus:border-red-500"
                              : "border-white/10 focus:border-purple-500"
                          }`}
                        >
                          <option value="">Select a service</option>
                          {serviceGroups.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                              {group.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="Other / Not sure yet">
                            Other / Not sure yet
                          </option>
                        </select>
                        {errors.service && (
                          <p className="mt-1 text-xs text-red-400">
                            {errors.service}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="budget" className={labelClass}>
                          Budget range
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="uwl-select w-full rounded-xl border border-white/10 px-4 py-3 focus:border-purple-500 focus:outline-none"
                        >
                          <option value="">Prefer not to say</option>
                          {BUDGET_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className={labelClass}>
                        About the project *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="What should it do, who uses it, and is there anything already built? A deadline or a reference site helps too."
                        className={`${fieldClass("message")} resize-y`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 py-3.5 font-semibold text-white transition-all duration-300 ${
                        isSubmitting
                          ? "cursor-not-allowed opacity-70"
                          : "hover:shadow-lg hover:shadow-purple-500/25 hover:brightness-110"
                      }`}
                    >
                      {isSubmitting ? (
                        "Sending…"
                      ) : (
                        <>
                          Send project details
                          <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11px] text-gray-500">
                      <FiLock className="h-3 w-3" />
                      Your details go to our inbox only — never sold or shared.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
