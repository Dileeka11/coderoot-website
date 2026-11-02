import type { MetadataRoute } from "next";
import { articles } from "@/lib/insights";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

/** Written to a plain file when the site is built. */
export const dynamic = "force-static";

const CONTENT_UPDATED = "2026-11-02";

/** The pages built into the site. Laravel lists the projects in /projects-sitemap.xml, so new ones need no rebuild. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/services`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${site.url}/pricing`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/quote`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/projects`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/how-we-work`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/technology`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/industries`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/insights`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.7 },
    ...articles.map((article) => ({
      url: `${site.url}/insights/${article.slug}`,
      lastModified: article.published,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${site.url}/faq`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/about`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/privacy`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];

  return pages;
}
