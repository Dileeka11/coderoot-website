import type { Metadata } from "next";
import { site } from "./site";

const defaultImage = { url: "/images/og.png", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` };

/**
 * Search results cut titles off at about 580 pixels of 20px Arial, which is roughly 57 characters
 * once " | CodeRoot Solutions" is added. Keep `title` to about 36 characters, and descriptions
 * between 120 and 160 characters.
 */
interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  /** Search phrases this page is about. The brand name is added to every page. */
  keywords?: readonly string[];
  /** Used instead of the brand image, for example a project's cover */
  image?: { url: string; alt: string };
  type?: "website" | "article";
}

/**
 * Next.js replaces the whole openGraph and twitter objects from a parent layout, so a page
 * that sets its own title would otherwise lose the share image and site name.
 */
export function pageMetadata({ title, description, path, keywords = [], image, type = "website" }: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  const images = [image ?? defaultImage];

  return {
    title,
    description,
    keywords: [...keywords, site.name],
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_LK",
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((item) => item.url),
    },
  };
}
