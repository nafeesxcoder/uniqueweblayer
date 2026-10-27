/**
 * COUNTRY PAGES — programmatic international SEO.
 * Each entry renders /web-development-company/<slug> with unique, country-specific content.
 * Add a country here and the page + sitemap entry are generated automatically.
 */

export interface Country {
  slug: string;
  name: string;
  /** Adjective form, e.g. "American", "British". */
  demonym: string;
  code: string; // ISO 3166-1 alpha-2
  currency: string;
  timezone: string;
  /** How our working hours line up with theirs. */
  overlap: string;
  cities: string[];
  payments: string[];
  /** One line about the local market — keeps each page unique for search engines. */
  marketNote: string;
}

export const countries: Country[] = [
  {
    slug: "united-states",
    name: "United States",
    demonym: "US",
    code: "US",
    currency: "USD ($)",
    timezone: "EST / CST / PST",
    overlap: "We start the day before your East Coast morning and stay online past PST lunch.",
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Dallas", "San Francisco", "Atlanta"],
    payments: ["Stripe", "PayPal", "Authorize.Net", "Square"],
    marketNote:
      "US buyers compare three or four vendors before replying, so we build sites that answer pricing, process and proof on the first scroll.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    demonym: "British",
    code: "GB",
    currency: "GBP (£)",
    timezone: "GMT / BST",
    overlap: "Four and a half hours of overlap every morning, with same-day replies all afternoon.",
    cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Bristol", "Liverpool"],
    payments: ["Stripe", "GoCardless", "PayPal", "Worldpay"],
    marketNote:
      "UK sites need clear VAT handling, GDPR-compliant forms and a cookie policy that will not get flagged.",
  },
  {
    slug: "canada",
    name: "Canada",
    demonym: "Canadian",
    code: "CA",
    currency: "CAD ($)",
    timezone: "EST / PST",
    overlap: "Your morning is our evening — daily stand-ups land comfortably for both sides.",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"],
    payments: ["Stripe", "Moneris", "PayPal", "Interac"],
    marketNote:
      "Bilingual English/French layouts and province-level service pages do most of the ranking work in Canada.",
  },
  {
    slug: "australia",
    name: "Australia",
    demonym: "Australian",
    code: "AU",
    currency: "AUD ($)",
    timezone: "AEST / AWST",
    overlap: "We are online through your whole working day — Australia is the easiest time zone we serve.",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast"],
    payments: ["Stripe", "Afterpay", "PayPal", "eWAY"],
    marketNote:
      "Australian trade and service businesses convert best with suburb-level landing pages and click-to-call headers.",
  },
  {
    slug: "united-arab-emirates",
    name: "United Arab Emirates",
    demonym: "Emirati",
    code: "AE",
    currency: "AED (د.إ)",
    timezone: "GST",
    overlap: "Only ninety minutes apart — effectively a shared working day.",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
    payments: ["Telr", "PayTabs", "Stripe", "Network International"],
    marketNote:
      "Arabic/English bilingual sites with right-to-left layouts are standard for UAE brands, and we build both directions from one codebase.",
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    demonym: "Saudi",
    code: "SA",
    currency: "SAR (﷼)",
    timezone: "AST",
    overlap: "Two and a half hours apart — same-day delivery on every request.",
    cities: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
    payments: ["PayTabs", "HyperPay", "Mada", "Stripe"],
    marketNote:
      "Saudi e-commerce needs Mada card support and Arabic-first content to compete in local search.",
  },
  {
    slug: "germany",
    name: "Germany",
    demonym: "German",
    code: "DE",
    currency: "EUR (€)",
    timezone: "CET",
    overlap: "Three and a half hours of live overlap, with written updates every evening.",
    cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart"],
    payments: ["Stripe", "Klarna", "SEPA Direct Debit", "PayPal"],
    marketNote:
      "German sites are judged on Impressum, strict GDPR consent and page speed — all three are part of our build checklist.",
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    demonym: "Dutch",
    code: "NL",
    currency: "EUR (€)",
    timezone: "CET",
    overlap: "Three and a half hours of live overlap every working day.",
    cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    payments: ["Mollie", "iDEAL", "Stripe", "Adyen"],
    marketNote:
      "iDEAL checkout is non-negotiable for Dutch e-commerce, and Dutch-language content outranks English every time.",
  },
  {
    slug: "france",
    name: "France",
    demonym: "French",
    code: "FR",
    currency: "EUR (€)",
    timezone: "CET",
    overlap: "Three and a half hours of live overlap, afternoons reserved for your calls.",
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux"],
    payments: ["Stripe", "Lydia", "PayPal", "Sofort"],
    marketNote:
      "French audiences expect fully localised copy — machine-translated sites lose both trust and rankings.",
  },
  {
    slug: "spain",
    name: "Spain",
    demonym: "Spanish",
    code: "ES",
    currency: "EUR (€)",
    timezone: "CET",
    overlap: "Three and a half hours of live overlap each day.",
    cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Malaga"],
    payments: ["Redsys", "Stripe", "Bizum", "PayPal"],
    marketNote:
      "Spanish SEO rewards regional pages — Madrid and Barcelona behave like separate markets in search.",
  },
  {
    slug: "italy",
    name: "Italy",
    demonym: "Italian",
    code: "IT",
    currency: "EUR (€)",
    timezone: "CET",
    overlap: "Three and a half hours of live overlap each working day.",
    cities: ["Rome", "Milan", "Naples", "Turin", "Florence"],
    payments: ["Stripe", "Satispay", "PayPal", "Nexi"],
    marketNote:
      "Italian buyers browse mostly on mobile, so we design the phone layout first and scale it up.",
  },
  {
    slug: "ireland",
    name: "Ireland",
    demonym: "Irish",
    code: "IE",
    currency: "EUR (€)",
    timezone: "GMT / IST",
    overlap: "Four and a half hours of overlap every morning.",
    cities: ["Dublin", "Cork", "Galway", "Limerick"],
    payments: ["Stripe", "Realex", "PayPal", "Revolut"],
    marketNote:
      "Irish service businesses rank fastest with county-level pages plus a well-tuned Google Business Profile.",
  },
  {
    slug: "singapore",
    name: "Singapore",
    demonym: "Singaporean",
    code: "SG",
    currency: "SGD ($)",
    timezone: "SGT",
    overlap: "Two and a half hours apart — a near-identical working day.",
    cities: ["Singapore", "Jurong", "Tampines", "Woodlands"],
    payments: ["Stripe", "PayNow", "GrabPay", "PayPal"],
    marketNote:
      "Singapore audiences expect fast, minimal, PDPA-compliant sites and instant WhatsApp or chat response.",
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    demonym: "New Zealand",
    code: "NZ",
    currency: "NZD ($)",
    timezone: "NZST",
    overlap: "Your afternoon is our morning — overnight progress is ready before you start.",
    cities: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
    payments: ["Stripe", "Windcave", "Afterpay", "PayPal"],
    marketNote:
      "New Zealand's small search volume makes precise long-tail keywords and local citations far more valuable than broad terms.",
  },
  {
    slug: "south-africa",
    name: "South Africa",
    demonym: "South African",
    code: "ZA",
    currency: "ZAR (R)",
    timezone: "SAST",
    overlap: "Three and a half hours of overlap, with full afternoon availability.",
    cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
    payments: ["PayFast", "Yoco", "Stripe", "Ozow"],
    marketNote:
      "Data costs matter here, so we keep pages light and aggressively optimise images for mobile networks.",
  },
  {
    slug: "qatar",
    name: "Qatar",
    demonym: "Qatari",
    code: "QA",
    currency: "QAR (﷼)",
    timezone: "AST",
    overlap: "Two and a half hours apart — same-day turnaround on everything.",
    cities: ["Doha", "Al Rayyan", "Al Wakrah"],
    payments: ["PayTabs", "QPay", "Stripe", "Checkout.com"],
    marketNote:
      "Qatari brands usually need bilingual Arabic/English sites with a strong corporate visual identity.",
  },
  {
    slug: "kuwait",
    name: "Kuwait",
    demonym: "Kuwaiti",
    code: "KW",
    currency: "KWD (د.ك)",
    timezone: "AST",
    overlap: "Two and a half hours apart — effectively the same working day.",
    cities: ["Kuwait City", "Hawalli", "Salmiya"],
    payments: ["KNET", "MyFatoorah", "Tap Payments", "Stripe"],
    marketNote:
      "KNET integration is essential for any Kuwaiti store that wants local customers to complete checkout.",
  },
  {
    slug: "india",
    name: "India",
    demonym: "Indian",
    code: "IN",
    currency: "INR (₹)",
    timezone: "IST",
    overlap: "Same time zone — calls, revisions and launches happen the same day.",
    cities: ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Noida", "Gurugram"],
    payments: ["Razorpay", "PayU", "UPI", "Cashfree"],
    marketNote:
      "Indian businesses convert on UPI-first checkouts, WhatsApp enquiries and fast mobile pages.",
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    demonym: "Malaysian",
    code: "MY",
    currency: "MYR (RM)",
    timezone: "MYT",
    overlap: "Two and a half hours apart — a comfortably shared day.",
    cities: ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh"],
    payments: ["iPay88", "Billplz", "Stripe", "GrabPay"],
    marketNote:
      "Malaysian sites usually run multilingual — English, Malay and Chinese — which we handle from one content base.",
  },
  {
    slug: "sweden",
    name: "Sweden",
    demonym: "Swedish",
    code: "SE",
    currency: "SEK (kr)",
    timezone: "CET",
    overlap: "Three and a half hours of overlap every working day.",
    cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"],
    payments: ["Klarna", "Swish", "Stripe", "Nets"],
    marketNote:
      "Swedish shoppers expect Klarna and Swish at checkout, and accessibility standards are taken seriously.",
  },
  {
    slug: "switzerland",
    name: "Switzerland",
    demonym: "Swiss",
    code: "CH",
    currency: "CHF (Fr)",
    timezone: "CET",
    overlap: "Three and a half hours of overlap, with scheduled calls on request.",
    cities: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne"],
    payments: ["Stripe", "TWINT", "PostFinance", "Datatrans"],
    marketNote:
      "Swiss sites often need German, French and Italian versions, each with its own hreflang and URL path.",
  },
  {
    slug: "norway",
    name: "Norway",
    demonym: "Norwegian",
    code: "NO",
    currency: "NOK (kr)",
    timezone: "CET",
    overlap: "Three and a half hours of overlap each day.",
    cities: ["Oslo", "Bergen", "Trondheim", "Stavanger"],
    payments: ["Vipps", "Klarna", "Stripe", "Nets"],
    marketNote:
      "Vipps checkout and Norwegian-language content are the two biggest conversion levers in this market.",
  },
  {
    slug: "japan",
    name: "Japan",
    demonym: "Japanese",
    code: "JP",
    currency: "JPY (¥)",
    timezone: "JST",
    overlap: "Your afternoon overlaps our morning, with written hand-offs overnight.",
    cities: ["Tokyo", "Osaka", "Nagoya", "Yokohama", "Fukuoka"],
    payments: ["Stripe", "PayPay", "Komoju", "Rakuten Pay"],
    marketNote:
      "Japanese users expect dense, information-rich pages and flawless Japanese typography — not a translated Western layout.",
  },
];

export const getCountry = (slug: string) =>
  countries.find((c) => c.slug === slug);

/** Regions listed in the footer and the hero marquee. */
export const serviceRegions = [
  "North America",
  "United Kingdom & Ireland",
  "Europe",
  "Middle East",
  "Asia-Pacific",
  "Australia & New Zealand",
  "Africa",
  "Latin America",
];
