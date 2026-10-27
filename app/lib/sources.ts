/**
 * Turning the stored `source` label into something readable.
 *
 * The labels themselves are written by sourceFromReferrer() in
 * lib/server/contact.ts when the enquiry is saved. Anything not listed here
 * is a bare hostname, which already reads fine, so it is shown as it is.
 *
 * Shared by the inbox and the Insights page so one enquiry is never
 * described two different ways.
 */
const SOURCE_NAMES: Record<string, string> = {
  direct: "Direct / typed the address",
  google: "Google search",
  bing: "Bing search",
  duckduckgo: "DuckDuckGo",
  yahoo: "Yahoo",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  twitter: "X / Twitter",
  other: "Somewhere else",
  unknown: "Not recorded",
};

export function prettySource(label?: string | null): string {
  if (!label) return SOURCE_NAMES.unknown;
  return SOURCE_NAMES[label] || label;
}

export function prettyPage(label?: string | null): string {
  if (!label) return "Not recorded";
  if (label === "unknown") return "Not recorded";
  if (label === "/") return "Home page";
  return label;
}
