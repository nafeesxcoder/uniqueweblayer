"use client";

import { useMemo } from "react";

/**
 * Starfield background.
 *
 * PERFORMANCE: this component is mounted on almost every section, so it must stay
 * cheap. The stars are plain <span>s twinkling with a CSS keyframe animation, which
 * runs on the compositor. The previous version rendered 150 framer-motion components
 * per instance — with 9 instances on the home page that was ~1,350 JavaScript
 * animation loops running at the same time, which made scrolling stutter.
 *
 * The positions come from a seeded generator (not Math.random) so the server and the
 * client produce identical markup and hydration never mismatches.
 */

const STAR_COUNT = 40;

/** Deterministic pseudo-random — same sequence on server and client. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface StarsProps {
  /** Lower this for small sections, raise it for full-page backgrounds. */
  count?: number;
  /** Change the seed to get a different (but still stable) pattern. */
  seed?: number;
  className?: string;
}

export const Stars = ({ count = STAR_COUNT, seed = 7, className = "" }: StarsProps) => {
  const stars = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, id) => ({
      id,
      top: `${(rand() * 100).toFixed(2)}%`,
      left: `${(rand() * 100).toFixed(2)}%`,
      size: `${(rand() * 2 + 1).toFixed(2)}px`,
      opacity: 0.2 + rand() * 0.5,
      delay: `${(rand() * 5).toFixed(2)}s`,
      duration: `${(2 + rand() * 3).toFixed(2)}s`,
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className="uwl-star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      <style jsx>{`
        .uwl-star {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: var(--star-color, #fff);
          will-change: opacity;
          animation-name: uwl-twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @keyframes uwl-twinkle {
          0%,
          100% {
            opacity: inherit;
          }
          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .uwl-star {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Stars;
