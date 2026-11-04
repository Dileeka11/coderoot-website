import type { Metadata, Viewport } from "next";
import { Inter, Saira } from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Preloader } from "@/components/site/Preloader";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/JsonLd";
import { site, siteKeywords } from "@/lib/site";
import "./globals.css";

const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
  display: "swap",
  // globals.css has a fallback matched to the capitals our headings use
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Under 580 pixels in search results. See lib/seo.ts. */
const defaultTitle = `Web Development Company in Sri Lanka | ${site.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...siteKeywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
    url: "/",
    locale: "en_LK",
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
    images: ["/images/og.png"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1E1F22",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${saira.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Preloader />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Header />
        <div className="scroll-progress" aria-hidden="true" />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
