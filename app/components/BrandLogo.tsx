/**
 * Brand logo that follows the theme.
 *
 * The main logo has a white wordmark, which disappears on a light background, so
 * both versions are rendered and CSS shows the right one (see globals.css). Doing
 * it in CSS rather than JavaScript means the correct logo is there on first paint,
 * with no flash and no layout shift.
 */
export default function BrandLogo({
  className = "h-10 md:h-12 w-auto object-contain",
}: {
  className?: string;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Unique Web Layer — web and mobile app development company"
        className={`uwl-logo-dark ${className}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-light.png"
        alt="Unique Web Layer — web and mobile app development company"
        className={`uwl-logo-light ${className}`}
      />
    </>
  );
}
