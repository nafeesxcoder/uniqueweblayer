/**
 * Oversized brand signature along the bottom of the footer: solid letters
 * fading into the edge, with a band of light sweeping across them. Letters are
 * filled rather than outlined because this font's glyphs overlap internally.
 * Purely decorative, so it is hidden from screen readers and ignores clicks.
 */
function Mark({
  id,
  text,
  width,
  className,
}: {
  id: string;
  text: string;
  width: number;
  className: string;
}) {
  const shared = {
    x: width / 2,
    y: 158,
    textAnchor: "middle" as const,
    textLength: width - 16,
    lengthAdjust: "spacingAndGlyphs" as const,
    className: "uwl-watermark-text",
  };

  return (
    <svg
      viewBox={`0 0 ${width} 176`}
      className={className}
      preserveAspectRatio="xMidYMax meet"
      role="presentation"
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8b4fe" stopOpacity="0.42" />
          <stop offset="0.55" stopColor="#c026d3" stopOpacity="0.2" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient
          id={`${id}-sheen`}
          gradientUnits="userSpaceOnUse"
          x1={-width * 0.3}
          y1="0"
          x2="0"
          y2="60"
        >
          <animate
            attributeName="x1"
            values={`${-width * 0.3};${width}`}
            dur="7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values={`0;${width * 1.3}`}
            dur="7s"
            repeatCount="indefinite"
          />
          <stop offset="0" stopColor="#f0abfc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.62" />
          <stop offset="1" stopColor="#f0abfc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text {...shared} fill={`url(#${id}-fill)`}>
        {text}
      </text>
      <text {...shared} fill={`url(#${id}-sheen)`} data-sheen="true">
        {text}
      </text>
    </svg>
  );
}

export default function FooterWatermark() {
  return (
    <div
      aria-hidden="true"
      className="uwl-watermark pointer-events-none mt-8 select-none overflow-hidden"
    >
      <Mark id="uwl-mark-wide" text="UNIQUE WEB LAYER" width={1600} className="hidden w-full md:block" />
      <Mark id="uwl-mark-small" text="UNIQUE" width={640} className="block w-full md:hidden" />
    </div>
  );
}
