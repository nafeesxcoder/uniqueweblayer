import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
import ClientLayout from "./ClientLayout";
import Analytics from "./components/Analytics";
import { SITE_URL, company } from "./data/site";
import {
  organizationSchema,
  serviceCatalogSchema,
  websiteSchema,
  hreflangAlternates,
  jsonLd,
} from "./lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Unique Web Layer | Web & Mobile App Development Company — Worldwide",
    template: "%s | Unique Web Layer",
  },

  description:
    "Unique Web Layer is a web and mobile app development company serving clients in every country. We build websites, React Native and Flutter apps, SaaS platforms and custom MERN software — plus SEO that ranks them. Remote delivery, fixed quotes, worldwide support.",

  keywords: [
    "web development company",
    "mobile app development company",
    "website development services worldwide",
    "react native app development company",
    "flutter app development company",
    "MERN stack development company",
    "Next.js development company",
    "SEO services company",
    "international SEO agency",
    "hire web developers offshore",
    "custom software development company",
    "ecommerce website development",
    "SaaS development company",
    "web design company for startups",
  ],

  authors: [{ name: company.name, url: SITE_URL }],
  creator: company.name,
  publisher: company.name,
  applicationName: company.name,
  category: "Technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: hreflangAlternates(""),

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },

  openGraph: {
    title: "Unique Web Layer | Web & Mobile App Development Company",
    description:
      "Websites, Android & iOS apps, SaaS platforms and SEO — delivered online to clients in every country.",
    url: SITE_URL,
    siteName: company.name,
    locale: "en_US",
    alternateLocale: ["en_GB", "en_CA", "en_AU", "en_IN", "en_SG", "en_AE"],
    type: "website",
    images: [
      {
        url: "/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "Unique Web Layer — Web & Mobile App Development Company",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Unique Web Layer | Web & Mobile App Development Company",
    description:
      "Websites • Mobile Apps • SaaS • E-Commerce • SEO — built for businesses worldwide.",
    images: ["/og/default.jpg"],
    creator: "@uniqueweblayer",
  },

  /**
   * Google Search Console verification.
   *
   * This is the single highest-impact SEO step left: until the site is
   * verified and the sitemap submitted, Google has no reliable signal that
   * these pages exist, and you have no view of what it is doing with them.
   *
   * 1. search.google.com/search-console → Add property → URL prefix
   * 2. Choose the "HTML tag" method and copy the content="..." value
   * 3. Paste it below, redeploy, then press Verify
   * 4. Submit https://uniqueweblayer.com/sitemap.xml under Sitemaps
   *
   * Do the same at bing.com/webmasters for Bing and ChatGPT search.
   */
  verification: {
    // google: "paste-the-content-value-here",
    // other: { "msvalidate.01": "paste-the-bing-value-here" },
  },
};

/**
 * suppressHydrationWarning on <html> is required: the inline script below sets
 * data-theme before React hydrates, so the server HTML and the first client
 * render differ by that one attribute. This is the supported pattern for
 * no-flash theme switching — do not remove it.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="m-0 p-0" suppressHydrationWarning>
      <head>
        {/*
          Applies the saved theme before first paint. Without this the page
          renders dark for a frame and then flips, which looks broken.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('uwl_theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}
/* The intro splash is for visitors arriving at the site. /admin is your own
   workspace — you open it several times a day and a four-second animation in
   front of your enquiries is just a wait. Marking it dismissed here, before the
   first paint, means the overlay never appears there at all; moving between
   pages still shows the thin route loader. */
try{if(location.pathname.indexOf('/admin')===0){document.documentElement.setAttribute('data-uwl-dismiss','1');}}catch(e){}
/* Drop the boot splash on the first real interaction, before React has even
   loaded. Otherwise someone who starts clicking during a slow first load keeps
   looking at an overlay nothing has hydrated yet to remove. */
try{var d=function(){document.documentElement.setAttribute('data-uwl-dismiss','1');};
['pointerdown','keydown','wheel','touchstart'].forEach(function(e){window.addEventListener(e,d,{once:true,capture:true,passive:true});});}catch(e){}})();`,
          }}
        />

        {/*
          Font Awesome used to be loaded here as a render-blocking stylesheet
          from cdnjs.cloudflare.com — ~70KB on every page, purely for icons,
          while react-icons was already bundled. Icons now come from
          components/Icon.tsx, so there is no third-party request, nothing
          blocking first paint, and no CDN that can fail independently.
        */}

        {/* Google Fonts, loaded by next/font above */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/*
          Removed: coverage, distribution, target, audience, language and
          rating meta tags. No major search engine has read any of them for
          well over a decade — they added bytes to every page and nothing else.
          Geographic relevance comes from the country landing pages, the
          areaServed schema and real content instead.
        */}
        <noscript>
          {/* Without JS nothing can remove the overlay — never show it. */}
          <style>{`#uwl-boot-splash{display:none!important}`}</style>
        </noscript>

        <meta name="apple-mobile-web-app-title" content={company.name} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
      </head>

      <body className={`${inter.className} antialiased bg-black m-0 p-0`}>
        {/*
          Painted on the very first frame, before React hydrates. The client
          <Preloader/> fades in behind it and removes this one on mount, so the
          visitor never sees the page flash into view ahead of the intro.
        */}
        <div id="uwl-boot-splash" aria-hidden="true">
          <div className="uwl-boot-wash" />
          <div className="uwl-boot-ring">
            <div className="uwl-boot-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.png" alt="" width={60} height={60} />
            </div>
          </div>
          <div className="uwl-boot-dots">
            <span />
            <span />
            <span />
          </div>
        </div>

        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema)}
        />
        <Script
          id="business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(serviceCatalogSchema)}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(websiteSchema)}
        />

        <ClientLayout>{children}</ClientLayout>

        {/* useSearchParams needs a boundary so the static pages still prerender */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
