// Types for Unique Web Layer

export interface Service {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceDisplay: string;
  delivery: string;
  features: string[];
}

export interface AddOn {
  name: string;
  price: number;
  description: string;
}

export interface PricingData {
  services: Service[];
  addOns: AddOn[];
}

export interface BusinessData {
  company: {
    name: string;
    tagline: string;
    founded: string;
    mission: string;
  };
  contact: {
    /** General enquiries, and where contact-form leads are delivered. */
    email: string;
    /** Projects, quotes and invoices — also the SMTP sending account. */
    emailSales: string;
    phone: string;
    phoneAlt: string;
    /** Country only — the company is remote and has no office address. */
    basedIn: string;
    whatsapp: string;
  };
  hours: {
    monday_friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  serviceArea: {
    primary: string[];
    global: string[];
    /** The country the team works from — not a service radius. */
    basedIn: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQData {
  faqs: FAQ[];
}

export interface ResponsesData {
  greetings: string[];
  farewells: string[];
  fallback: string;
  booking: string;
}