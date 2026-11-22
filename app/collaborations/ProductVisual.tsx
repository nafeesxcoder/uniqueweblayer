import type { Product } from "../lib/productTypes";

/** Mixes a #rrggbb colour toward white, so the gradient works in every browser. */
function lighten(hex: string, amount: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const c = (value >> shift) & 255;
    return Math.round(c + (255 - c) * amount)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

export const brandGradient = (p: Pick<Product, "brandColor" | "accentColor">) =>
  `linear-gradient(135deg, ${p.brandColor}, ${lighten(p.brandColor, 0.24)})`;

/** The product's uploaded logo, or a clean initial until one is added. */
export function ProductLogo({
  product,
  size = 56,
}: {
  product: Product;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg"
      style={{
        width: size,
        height: size,
        background: product.logo ? "#ffffff" : brandGradient(product),
      }}
    >
      {product.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.logo}
          alt={`${product.name} logo`}
          className="h-full w-full object-contain p-1.5"
        />
      ) : (
        <b style={{ color: "#ffffff", fontSize: size * 0.42 }}>
          {product.name.charAt(0).toUpperCase()}
        </b>
      )}
    </span>
  );
}

/**
 * The large picture beside a product: its screenshot in a browser frame, or a
 * branded panel of its real highlights until a screenshot is uploaded.
 */
export default function ProductVisual({ product }: { product: Product }) {
  if (product.heroImage) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
        <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: "#ece9f3" }}>
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#f87171" }} />
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#fbbf24" }} />
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#34d399" }} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.heroImage}
          alt={`${product.name} screenshot`}
          className="block aspect-[16/10] w-full object-cover object-top"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="uwl-onbrand relative overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8"
      style={{ background: brandGradient(product) }}
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
      <div className="relative">
        <div className="flex items-center gap-3">
          <ProductLogo product={product} size={52} />
          <div>
            <p className="text-xl font-bold text-white">{product.name}</p>
            <p className="text-xs text-white/80">{product.category}</p>
          </div>
        </div>
        <p className="mt-6 text-2xl font-bold leading-tight text-white sm:text-3xl">
          {product.tagline}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {product.content.highlights.slice(0, 4).map((h) => (
            <div
              key={h.label}
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.16)" }}
            >
              <p className="text-lg font-bold text-white">{h.value}</p>
              <p className="text-[11px] leading-snug text-white/85">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
