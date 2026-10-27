import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /*
   * Pin the workspace root to this folder.
   *
   * Next works it out from the nearest lockfile, and a stray package-lock.json
   * left in a parent folder — Downloads, or the Windows home directory — makes
   * it treat that whole folder as the project. It then walks every file under
   * it while tracing, and the build appears to hang for several minutes.
   * Saying it outright costs nothing and cannot drift.
   */
  outputFileTracingRoot: projectRoot,

  /*
   * Build with one worker instead of a pool.
   *
   * On shared hosting (CloudLinux) the account has a hard cap on how many
   * processes may run at once. Next's build spawns a worker per CPU for
   * compiling and for pre-rendering pages, hits that cap, and dies with
   * `spawn … EAGAIN` — which reads like a missing binary but means "not
   * allowed to start another process".
   *
   * One worker is slower — a few minutes instead of under one — and it is the
   * difference between a build that finishes on the server and one that never
   * does. A laptop has no such cap, so this costs nothing in development.
   */
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
  },

  /*
   * No `images.remotePatterns` any more. Uploaded screenshots used to live on
   * a separate API origin; they are now written to ./uploads and served by
   * this same app via app/uploads/[...path]/route.ts, so every image path is
   * local and relative.
   */

  async redirects() {
    return [
      // /work was renamed to /portfolio. 308 keeps the existing search ranking.
      { source: "/work", destination: "/portfolio", permanent: true },
      { source: "/work/:path*", destination: "/portfolio/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
