"use client";

import dynamic from "next/dynamic";

// Dynamically import with no SSR to avoid hydration issues
const WhatsAppFloat = dynamic(
  () => import("./WhatsAppFloat").then((mod) => mod.WhatsAppFloat),
  { ssr: false },
);

export default function WhatsAppWrapper() {
  return (
    <WhatsAppFloat
      phoneNumber="+917409233994"
      message="Hi! I need help with a website / mobile app / SEO. Can you assist?"
      position="bottom-right"
      pulseAnimation={true}
    />
  );
}
