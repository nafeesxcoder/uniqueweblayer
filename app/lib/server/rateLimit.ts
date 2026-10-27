import "server-only";
import { ApiError } from "./respond";

/**
 * Fixed-window rate limiter, replacing express-rate-limit.
 *
 * State lives in this process's memory, exactly as express-rate-limit's default
 * store did, so the behaviour is unchanged: it stops a bot hammering the
 * contact form or guessing the admin password, and it resets if the app
 * restarts. It does NOT coordinate across multiple instances — the site runs as
 * a single Node process on cPanel, so that is fine. Move the counter to MySQL
 * or Redis if it is ever scaled out.
 *
 * Cached on globalThis so dev hot-reloads don't wipe the counters.
 */

type Hit = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __uwlRateLimit: Map<string, Hit> | undefined;
}

const hits: Map<string, Hit> = global.__uwlRateLimit ?? new Map();
if (process.env.NODE_ENV !== "production") global.__uwlRateLimit = hits;

/** Best-effort client IP, trusting the proxy headers cPanel/Cloudflare set. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Throws a 429 once `max` requests from one IP land inside `windowMs`.
 * `bucket` keeps unrelated routes from sharing a counter.
 */
export function rateLimit(
  request: Request,
  {
    bucket,
    max,
    windowMs,
    message = "Too many requests — please try again shortly",
  }: { bucket: string; max: number; windowMs: number; message?: string },
): void {
  const key = `${bucket}:${clientIp(request)}`;
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    sweep(now);
    return;
  }

  entry.count += 1;
  if (entry.count > max) throw new ApiError(429, message);
}

/**
 * Drop expired keys occasionally. Without this the map grows for every IP that
 * ever hits the site and never shrinks — a slow memory leak on a long-running
 * process.
 */
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, value] of hits) {
    if (value.resetAt <= now) hits.delete(key);
  }
}
