import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const apiOrigin = (process.env.API_ORIGIN ?? "http://127.0.0.1:8000").replace(/\/$/, "");

/**
 * The live site is plain files on PHP hosting, built with NEXT_OUTPUT=export. Laravel runs on the
 * same domain, and the deploy .htaccess does the job of the rewrites and headers below.
 * Without it, `next dev` and `next start` keep working against a local Laravel.
 */
const isExport = process.env.NEXT_OUTPUT === "export";

/**
 * Pages are static for speed, which rules out per-request nonces, so inline scripts stay
 * allowed for Next.js's own bootstrap. There are no third-party scripts and all content
 * goes through React's escaping. Everything else is locked to this origin.
 * Keep it the same as the one in deploy/public.htaccess.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
];

const serverOnly: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${apiOrigin}/api/v1/:path*` },
      { source: "/media/:path*", destination: `${apiOrigin}/storage/:path*` },
      { source: "/projects-sitemap.xml", destination: `${apiOrigin}/projects-sitemap.xml` },
      { source: "/projects/:slug((?!item$)[a-z0-9-]+)", destination: "/projects/item" },
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/images/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" } : serverOnly),
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Laravel already turns every upload into a resized WebP, so the images are served as they are.
    unoptimized: true,
  },
};

export default nextConfig;
