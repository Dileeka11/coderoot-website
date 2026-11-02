/**
 * Everything on the pricing page. Set a package's price here as a plain number, such as 45000.
 * While price is null the page shows [TBC].
 * The owner chose these packages and prices from sourcecode.lk on 2026-11-02.
 */
export interface Plan {
  name: string;
  /** Who this package suits */
  bestFor: string;
  price: number | null;
  /** Shown after the price for packages paid again and again, such as "month" */
  per?: string;
  /** The one package we suggest to most people */
  featured?: boolean;
  features: string[];
}

export interface PricingGroup {
  /** The same slug as the service where there is one, so a service page can link straight to its packages */
  slug: string;
  tab: string;
  title: string;
  lead: string;
  /** A line under the packages that applies to all of them */
  note?: string;
  plans: Plan[];
}

export const pricing: PricingGroup[] = [
  {
    slug: "website-development",
    tab: "Web development",
    title: "Web development packages",
    lead: "For businesses that want to show what they do and make it easy for people to get in touch.",
    plans: [
      {
        name: "Starter",
        bestFor: "The simplest package to get you started",
        price: 30000,
        features: [
          "8 main pages",
          "1 proposal",
          "Simple control panel to update the website",
          "Set up hosting and domain name",
          "Create emails",
          "Contact form + location map",
          "Language translator (Google or Bing)",
        ],
      },
      {
        name: "Business",
        bestFor: "A complete website for a growing business",
        price: 45000,
        featured: true,
        features: [
          "12 main web pages",
          "1 proposal design concept",
          "Mobile responsive design",
          "Unique content development",
          "Basic search engine optimisation",
          "Simple control panel to update the website",
          "Unlimited bandwidth",
          "3 email accounts",
          "Contact form + location map",
          "Language translator (Google or Bing)",
          "Free one month maintenance",
        ],
      },
      {
        name: "Medium Company",
        bestFor: "Built for medium companies",
        price: 60000,
        features: [
          "20 main web pages",
          "2 proposal design concepts",
          "Mobile responsive design",
          "Payment gateway",
          "Unique content development",
          "Advanced search engine optimisation",
          "Advanced control panel to update the website",
          "Free .com domain",
          "5 email accounts",
          "Contact form + location map",
          "Language translator (Google, Bing or manual)",
        ],
      },
      {
        name: "Enterprise",
        bestFor: "The most advanced and complete package",
        price: 80000,
        features: [
          "25 main web pages",
          "2 proposal design concepts",
          "Mobile responsive design",
          "User and member registration",
          "Shopping cart & payment gateway",
          "Unique content development",
          "Advanced search engine optimisation",
          "Advanced control panel to update the website",
          "Free .com domain",
          "Free unlimited hosting space",
          "Unlimited bandwidth",
          "10 email accounts",
          "Contact form + location map",
          "Language translator (Google, Bing or manual)",
        ],
      },
    ],
  },
  {
    slug: "seo",
    tab: "SEO",
    title: "SEO packages",
    lead: "Ranking high on Google takes time and steady work. Pick the monthly package that fits how many keywords you want to win.",
    plans: [
      {
        name: "Starter",
        bestFor: "Basic SEO package",
        price: 13000,
        per: "month",
        features: [
          "Monthly package",
          "5 keywords",
          "Site optimisation",
          "Full page optimisation",
          "Keyword research",
          "HTML code cleanup & page optimisation",
          "Title optimisation",
          "Mobile friendly check",
          "Sitemap creation",
          "Webmaster tools setup",
          "Google Analytics setup & integration",
        ],
      },
      {
        name: "Business",
        bestFor: "Standard SEO package",
        price: 20000,
        per: "month",
        featured: true,
        features: [
          "8 keywords",
          "Site optimisation",
          "All pages optimisation",
          "Keyword research",
          "Code cleanup & optimisation",
          "Meta tags optimisation",
          "Mobile user friendly check",
          "Sitemap added to website",
          "Webmaster tools setup",
          "Google Analytics setup",
          "Google & Bing webmaster tools",
          "Monthly report",
        ],
      },
      {
        name: "Medium Company",
        bestFor: "Advanced SEO package",
        price: 30000,
        per: "month",
        features: [
          "15 keywords",
          "Site optimisation",
          "All page optimisation",
          "Keyword research & integration",
          "Code cleanup & page optimisation",
          "Title & meta tags optimisation",
          "Mobile user friendly check",
          "Sitemap creation",
          "Google webmaster tools",
          "Google Analytics integration",
          "Monthly report",
        ],
      },
      {
        name: "Enterprise",
        bestFor: "Premium SEO package",
        price: 40000,
        per: "month",
        features: [
          "20 keywords",
          "Site optimisation",
          "All pages optimisation",
          "Keyword research",
          "Code cleanup & page optimisation",
          "Title & meta tags optimisation",
          "Mobile friendly check",
          "Sitemap creation & integration",
          "Bing webmaster tools setup",
          "Analytics setup & integration",
          "Monthly report",
        ],
      },
    ],
  },
  {
    slug: "social-media",
    tab: "Social media",
    title: "Social media marketing packages",
    lead: "Regular posts and boosts that keep your business in front of the people who follow it.",
    plans: [
      {
        name: "Starter",
        bestFor: "Basic social package",
        price: 5000,
        per: "month",
        features: ["1 creative graphic design", "1 design post", "Unlimited post revision", "Post boost setup"],
      },
      {
        name: "Business",
        bestFor: "Standard social package",
        price: 8000,
        per: "month",
        featured: true,
        features: [
          "1 creative graphic design",
          "3 design posts",
          "Unlimited post revision",
          "Research & add hashtags",
          "Post boost setup",
          "Unique content",
          "Final monthly report",
        ],
      },
      {
        name: "Medium Company",
        bestFor: "Advanced social package",
        price: 14000,
        per: "month",
        features: [
          "2 creative graphic designs",
          "6 design posts",
          "Unlimited post revision",
          "Research & add hashtags",
          "Post boost setup",
          "Unique content",
          "Page correction",
          "Free page likes & reach",
          "Final monthly report",
        ],
      },
    ],
  },
  {
    slug: "graphic-design",
    tab: "Graphic design",
    title: "Graphic design packages",
    lead: "Logos, cards and brand designs, from a single logo to a full brand identity.",
    note: "Unlimited revisions for any design.",
    plans: [
      {
        name: "Starter",
        bestFor: "Basic logo package",
        price: 3000,
        features: ["1 logo design", "1 mock file", "All file formats (.jpg, .png)", "Source file"],
      },
      {
        name: "Business",
        bestFor: "Logo + card package",
        price: 5000,
        featured: true,
        features: ["1 logo design", "1 mock file", "Visiting card design", "All file formats (.jpg, .png)", "Source file"],
      },
      {
        name: "Medium Company",
        bestFor: "Complete branding package",
        price: 10000,
        features: ["2 logo designs", "2 mock files", "Visiting card design", "Letterhead design", "All file formats (.jpg, .png)", "Source file"],
      },
      {
        name: "Enterprise",
        bestFor: "Full brand identity package",
        price: 15000,
        features: [
          "2 logo designs",
          "2 mock files",
          "Visiting card design",
          "Letterhead design",
          "Facebook cover page design",
          "YouTube banner design",
          "Free 2 Facebook post designs",
          "All file formats (.jpg, .png)",
          "Source file",
        ],
      },
    ],
  },
];

/** What the quote form needs to recognise a package in its link, without the rest of this file */
export const planNames: Record<string, string[]> = Object.fromEntries(
  pricing.map((group) => [group.slug, group.plans.map((plan) => plan.name)]),
);

/** Services that have packages, so a service page only links to packages that exist */
export const pricedSlugs = pricing.map((group) => group.slug);

export function formatPrice(price: number | null) {
  return price === null ? "[TBC]" : price.toLocaleString("en-US");
}
