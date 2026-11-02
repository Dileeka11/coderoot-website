import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Written to a plain file when the site is built. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/projects-sitemap.xml`],
    host: site.url,
  };
}
