/**
 * Project terms, payment and hosting: the shape and the default wording.
 *
 * The live copy is edited from /admin/terms and stored in the database. These
 * defaults are used until that first save, and whenever the stored copy is
 * missing a field. A signed quote for a specific project always takes
 * precedence over these terms.
 */

export interface PaymentStage {
  percent: number;
  label: string;
  gets: string;
}

export interface TermsSection {
  title: string;
  points: string[];
}

export interface TermsContent {
  updated: string;
  largeThreshold: string;
  stages: PaymentStage[];
  smallSplit: string;
  hostingIncludedYears: number;
  renewalINR: string;
  renewalUSD: string;
  supportDays: number;
  sections: TermsSection[];
  notice: string;
  signedBy: string;
  signedRole: string;
  /** Public path of the founder's signature. Empty means the built-in one. */
  signature: string;
}

export const DEFAULT_SIGNATURE = "/brand/founder-signature.png";

export const defaultTerms: TermsContent = {
  updated: "22 November 2026",
  largeThreshold: "$1,500 or INR 1,00,000",
  stages: [
    { percent: 30, label: "To start", gets: "Requirements, written scope and the design plan" },
    { percent: 40, label: "Midpoint", gets: "A working demo on a staging link to review and approve" },
    { percent: 30, label: "On delivery", gets: "The final site, source code, hosting and domain access" },
  ],
  smallSplit: "50% to start and 50% on delivery",
  hostingIncludedYears: 1,
  renewalINR: "INR 6,000",
  renewalUSD: "$100",
  supportDays: 30,
  sections: [
    {
      title: "Payment",
      points: [
        "Projects above $1,500 or INR 1,00,000 are paid in three stages: 30% to start, 40% at the midpoint after a demo, and 30% on delivery.",
        "Smaller projects are paid 50% to start and 50% on delivery.",
        "No work begins until the first payment is received.",
        "Quotes are in USD for international clients and INR for Indian clients. Each invoice states its currency.",
        "Payment is accepted by bank transfer, PayPal, Stripe, or UPI for Indian clients.",
        "Prices exclude applicable taxes. Indian GST is added where it applies. International clients are responsible for any VAT or sales tax in their own country, unless we are required to collect it.",
        "If a payment is more than 14 days overdue, work pauses until it is cleared.",
      ],
    },
    {
      title: "How a project is run",
      points: [
        "The scope is agreed in writing before work starts, with a feature list and a timeline.",
        "Two rounds of revisions are included at each stage. Changes outside the agreed scope are quoted separately and start only after written approval.",
        "You review a staging link at each stage and approve it in writing. An email is enough.",
        "The timeline is shared at kickoff, with a progress update every week.",
      ],
    },
    {
      title: "Hosting and domain",
      points: [
        "Hosting and SSL are included for 1 year from the date of launch.",
        "The domain is registered in your name, or transferred to you at handover. You keep the login.",
        "You get a renewal reminder 30 days before the renewal date, and there is a 14-day grace period after expiry.",
        "If renewal is not paid after the grace period, the site is taken offline. Files and the database are kept for 60 more days, and then deleted.",
      ],
    },
    {
      title: "Yearly renewal",
      points: [
        "From year 2, hosting and SSL renew at INR 6,000 per year for Indian clients, or $100 per year for international clients.",
        "The domain renewal is charged at the registrar's rate.",
        "If our provider's rates change, we will give 60 days notice before any change to your renewal price.",
      ],
    },
    {
      title: "Support after launch",
      points: [
        "30 days of bug fixes after handover, covering errors in the agreed scope.",
        "New features and content changes are not included. Ongoing care is available as a separate maintenance plan.",
      ],
    },
    {
      title: "Ownership",
      points: [
        "After the final payment, you own the source code and the content of your project.",
        "Until then, the work remains ours.",
        "We may show the project in our portfolio, unless you tell us in writing that you do not want it shown.",
      ],
    },
    {
      title: "Refunds and cancellation",
      points: [
        "The first payment is non-refundable once work has started.",
        "If we cannot deliver the agreed scope, you receive a refund for the unused amount.",
        "Either party can end the project with written notice. Work completed up to that point is payable.",
      ],
    },
    {
      title: "Confidentiality",
      points: [
        "We keep your business information confidential and use it only for your project.",
        "We do not sell client data.",
      ],
    },
    {
      title: "Governing law and disputes",
      points: [
        "These terms are governed by the laws of India.",
        "A dispute is first discussed in good faith for 15 days. If it is still unresolved, it goes to arbitration in India, conducted in English.",
        "Communication happens by email, WhatsApp, or video call, as agreed at kickoff.",
      ],
    },
  ],
  notice:
    "This page is a summary of how we work. A signed quote or agreement for your project takes precedence over it.",
  signedBy: "Nafees Ahmad",
  signedRole: "Founder, Unique Web Layer",
  signature: "",
};
