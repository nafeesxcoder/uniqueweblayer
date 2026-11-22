/**
 * Project terms, payment and hosting.
 *
 * One source for the public /project-terms page, the downloadable PDF and the
 * payment summary on /process. Edit the numbers and wording here, then deploy.
 * A signed quote for a specific project always takes precedence over this page.
 */

export const TERMS_UPDATED = "22 November 2026";

export const LARGE_PROJECT_THRESHOLD = "$1,500 or INR 1,00,000";

export const paymentStages = [
  {
    percent: 30,
    label: "To start",
    gets: "Requirements, written scope and the design plan",
  },
  {
    percent: 40,
    label: "Midpoint",
    gets: "A working demo on a staging link to review and approve",
  },
  {
    percent: 30,
    label: "On delivery",
    gets: "The final site, source code, hosting and domain access",
  },
];

export const smallProjectSplit = "50% to start and 50% on delivery";

export const pricing = {
  hostingIncludedYears: 1,
  renewalINR: "INR 6,000",
  renewalUSD: "$100",
  supportDays: 30,
};

export interface TermsSection {
  title: string;
  points: string[];
}

export const termsSections: TermsSection[] = [
  {
    title: "1. Payment",
    points: [
      `Projects above ${LARGE_PROJECT_THRESHOLD} are paid in three stages: 30% to start, 40% at the midpoint after a demo, and 30% on delivery.`,
      `Smaller projects are paid ${smallProjectSplit}.`,
      "No work begins until the first payment is received.",
      "Quotes are in USD for international clients and INR for Indian clients. Each invoice states its currency.",
      "Payment is accepted by bank transfer, PayPal, Stripe, or UPI for Indian clients.",
      "Prices exclude applicable taxes. Indian GST is added where it applies. International clients are responsible for any VAT or sales tax in their own country, unless we are required to collect it.",
      "If a payment is more than 14 days overdue, work pauses until it is cleared.",
    ],
  },
  {
    title: "2. How a project is run",
    points: [
      "The scope is agreed in writing before work starts, with a feature list and a timeline.",
      "Two rounds of revisions are included at each stage. Changes outside the agreed scope are quoted separately and start only after written approval.",
      "You review a staging link at each stage and approve it in writing. An email is enough.",
      "The timeline is shared at kickoff, with a progress update every week.",
    ],
  },
  {
    title: "3. Hosting and domain",
    points: [
      `Hosting and SSL are included for ${pricing.hostingIncludedYears} year from the date of launch.`,
      "The domain is registered in your name, or transferred to you at handover. You keep the login.",
      "You get a renewal reminder 30 days before the renewal date, and there is a 14-day grace period after expiry.",
      "If renewal is not paid after the grace period, the site is taken offline. Files and the database are kept for 60 more days, and then deleted.",
    ],
  },
  {
    title: "4. Yearly renewal",
    points: [
      `From year 2, hosting and SSL renew at ${pricing.renewalINR} per year for Indian clients, or ${pricing.renewalUSD} per year for international clients.`,
      "The domain renewal is charged at the registrar's rate.",
      "If our provider's rates change, we will give 60 days notice before any change to your renewal price.",
    ],
  },
  {
    title: "5. Support after launch",
    points: [
      `${pricing.supportDays} days of bug fixes after handover, covering errors in the agreed scope.`,
      "New features and content changes are not included. Ongoing care is available as a separate maintenance plan.",
    ],
  },
  {
    title: "6. Ownership",
    points: [
      "After the final payment, you own the source code and the content of your project.",
      "Until then, the work remains ours.",
      "We may show the project in our portfolio, unless you tell us in writing that you do not want it shown.",
    ],
  },
  {
    title: "7. Refunds and cancellation",
    points: [
      "The first payment is non-refundable once work has started.",
      "If we cannot deliver the agreed scope, you receive a refund for the unused amount.",
      "Either party can end the project with written notice. Work completed up to that point is payable.",
    ],
  },
  {
    title: "8. Confidentiality",
    points: [
      "We keep your business information confidential and use it only for your project.",
      "We do not sell client data.",
    ],
  },
  {
    title: "9. Governing law and disputes",
    points: [
      "These terms are governed by the laws of India.",
      "A dispute is first discussed in good faith for 15 days. If it is still unresolved, it goes to arbitration in India, conducted in English.",
      "Communication happens by email, WhatsApp, or video call, as agreed at kickoff.",
    ],
  },
];

export const termsNotice =
  "This page is a summary of how we work. A signed quote or agreement for your project takes precedence over it.";
