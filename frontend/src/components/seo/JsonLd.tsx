import { site } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationId = `${site.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": organizationId,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    logo: `${site.url}/android-chrome-512x512.png`,
    image: `${site.url}/images/og.png`,
    email: site.email,
    telephone: site.phone.international,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    areaServed: { "@type": "Country", name: site.address.country },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: site.phone.international,
      email: site.email,
      areaServed: site.address.countryCode,
    },
    knowsAbout: [
      "Website development",
      "Web design",
      "Web application development",
      "Custom software development",
      "Ecommerce website development",
      "Search engine optimisation",
      "Social media marketing",
      "Graphic design",
    ],
    sameAs: Object.values(site.social),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { "@id": organizationId },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function faqSchema(items: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
