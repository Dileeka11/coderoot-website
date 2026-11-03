import type { ShapeName } from "./roots/shapes";

export interface Service {
  slug: string;
  /** The 3D shape that stands for this service */
  shape: ShapeName;
  /** Shown as a folder in the services tree on the home page */
  folder: string;
  title: string;
  nav: string;
  seoTitle: string;
  seoDescription: string;
  /** One line for lists */
  short: string;
  intro: string;
  includes: string[];
  goodFor: string[];
  /** Kinds of thing we can build under this service */
  builds: { title: string; body: string }[];
  /** What we pay most attention to in this kind of project */
  focus: { title: string; body: string }[];
  /** Tools from the technology page that this service mostly uses */
  tools: string[];
  faqs: { question: string; answer: string }[];
}

const quoteAnswer =
  "Our pricing page shows our packages and what each one includes. The final price depends on what you need, so we send you a free written quote with a clear scope before any work starts.";

export const services: Service[] = [
  {
    slug: "website-development",
    shape: "browser",
    folder: "websites/",
    title: "Websites",
    nav: "Website development",
    seoTitle: "Website Development in Sri Lanka",
    seoDescription:
      "Fast, mobile friendly business websites built in Sri Lanka, set up to be found on Google and easy to keep up to date. Get a free quote from CodeRoot Solutions.",
    short: "Clear, fast websites that show customers what you do and make it easy to contact you.",
    intro:
      "Your website is often the first thing a customer sees. We build clear, fast sites that explain what you do and make it easy for people to get in touch, on any device.",
    includes: [
      "A design made for your business and your brand",
      "Pages that work well on phones, tablets and computers",
      "Fast loading, even on slower connections",
      "Search engine setup: titles, structured data and a sitemap",
      "An admin panel for content you change often, if you need one",
      "HTTPS, security headers and safe forms",
    ],
    goodFor: [
      "New businesses that need their first website",
      "Companies whose current site is slow, dated or hard to update",
      "Businesses launching a new product or service",
    ],
    builds: [
      { title: "Company websites", body: "A professional home for your business, with your services, your story and your contact details." },
      { title: "Online stores", body: "Sell online, with products and orders you can manage yourself." },
      { title: "Landing pages", body: "One focused page for a product, a campaign or an event." },
      { title: "Booking and enquiry sites", body: "Let customers send an enquiry or ask for a time without having to call." },
      { title: "Portfolio sites", body: "Show your work with galleries and project pages that you can add to over time." },
      { title: "Website redesigns", body: "Turn an old or slow site into something fast and easy to update, and keep what already works." },
    ],
    focus: [
      { title: "Made for phones", body: "Many of your customers will first see you on a phone. We design for that, then make it work everywhere else." },
      { title: "Quick to open", body: "Compressed images and lean code, so pages load even on slower connections." },
      { title: "Ready for search", body: "Clear titles, structured data and a sitemap. We set this up properly, and we will not promise a ranking." },
    ],
    tools: ["Next.js", "React", "Tailwind CSS", "Filament"],
    faqs: [
      { question: "How much does a website cost?", answer: quoteAnswer },
      {
        question: "How long does it take to build?",
        answer:
          "It depends on the number of pages and features. You get a clear timeline with your quote, before any work starts.",
      },
      {
        question: "Can I update the website myself?",
        answer:
          "Yes, if you need to. We can add an admin panel so your team can change content without touching any code.",
      },
      {
        question: "Will my website show up on Google?",
        answer:
          "We set up the technical side properly so search engines can read your site. Where it ranks also depends on your content and your competition, so we will not promise a position.",
      },
    ],
  },
  {
    slug: "web-application-development",
    shape: "stack",
    folder: "webapps/",
    title: "Web apps",
    nav: "Web app development",
    seoTitle: "Web Application Development in Sri Lanka",
    seoDescription:
      "Web apps built around your business: portals, dashboards and booking systems your team and customers can use from any browser. Free quote from CodeRoot Solutions.",
    short: "Online tools your team and customers can use in the browser, with nothing to install.",
    intro:
      "A web app runs in the browser, so your team and your customers can use it from any device with nothing to install. We plan it around how people will really use it, then build it to last.",
    includes: [
      "Customer portals and booking systems",
      "Dashboards and tools for your team",
      "Logins, roles and permissions",
      "A database that is designed around your data",
      "Connections to services you already use",
      "Testing before launch and support after it",
    ],
    goodFor: [
      "Work that has outgrown spreadsheets",
      "Services your customers should be able to use online",
      "Teams that need the same, up to date information in one place",
    ],
    builds: [
      { title: "Customer portals", body: "A private area where customers can see their orders, invoices or requests." },
      { title: "Booking systems", body: "Appointments, classes or rentals, without double bookings or endless phone calls." },
      { title: "Dashboards", body: "The numbers your team needs, up to date and in one place." },
      { title: "Admin panels", body: "Manage your content, users and data without touching any code." },
      { title: "Member areas", body: "Logins and private content for members, students or staff." },
      { title: "Forms and approvals", body: "Replace paper forms and long email chains with a simple flow: request, approve, done." },
    ],
    focus: [
      { title: "Built around real use", body: "We work out how people will really use it before we design a single screen." },
      { title: "The right access for everyone", body: "Roles and permissions, so each person sees only what they should." },
      { title: "Room to grow", body: "Start with what you need most, then add more without starting again." },
    ],
    tools: ["Next.js", "React", "Laravel", "Node.js", "MySQL", "PostgreSQL", "MongoDB", "Filament"],
    faqs: [
      {
        question: "What is the difference between a website and a web app?",
        answer:
          "A website mainly gives people information. A web app lets them do something: log in, book, manage records or run part of your business.",
      },
      {
        question: "Do people need to install anything?",
        answer: "No. A web app opens in a normal browser on a phone, tablet or computer.",
      },
      { question: "How much does a web app cost?", answer: quoteAnswer },
      {
        question: "Can you add features later?",
        answer:
          "Yes. We can start with what you need most, launch it, and add more as your business grows.",
      },
    ],
  },
  {
    slug: "custom-software-development",
    shape: "gear",
    folder: "software/",
    title: "Custom software",
    nav: "Custom software development",
    seoTitle: "Custom Software Development in Sri Lanka",
    seoDescription:
      "Software built around how your business works: replace manual steps, connect your tools and grow without limits. Free quote from CodeRoot Solutions, Sri Lanka.",
    short: "Software shaped around how your business works, not the other way round.",
    intro:
      "Off-the-shelf software makes you work its way. Custom software is built around how your business already runs, and it can change as you grow.",
    includes: [
      "Business systems built around your workflow",
      "Fewer manual steps and fewer spreadsheets",
      "Connections between the tools you already use",
      "Reports that show you what you need to know",
      "Access control for different roles in your team",
      "Maintenance and support after launch",
    ],
    goodFor: [
      "Businesses where ready made software does not fit",
      "Teams losing time to repeated manual work",
      "Companies planning to grow and needing software that can keep up",
    ],
    builds: [
      { title: "Stock and inventory systems", body: "Know what you have and where it is, without counting by hand." },
      { title: "Sales and billing tools", body: "Quotes, invoices and sales records that stay in step with each other." },
      { title: "Staff and attendance systems", body: "Staff records, leave and attendance in one place." },
      { title: "Customer records", body: "Every customer, call and follow up where your whole team can find it." },
      { title: "Reports", body: "The reports that take hours today, ready whenever you need them." },
      { title: "Connections between tools", body: "Make your separate systems share information, so nobody types the same thing twice." },
    ],
    focus: [
      { title: "Your process comes first", body: "We learn how your business runs, then build around it, not the other way round." },
      { title: "One place for your information", body: "No more hunting through spreadsheets, notebooks and chat messages." },
      { title: "Honest advice", body: "If a ready made tool would serve you better, we will tell you before you spend anything." },
    ],
    tools: ["Laravel", "Java", "Python", "MySQL", "PostgreSQL", "Filament", "React"],
    faqs: [
      {
        question: "When is custom software worth it?",
        answer:
          "When ready made tools force you to change how you work, or when manual work is costing you time every week. If a ready made tool is the better fit for you, we will say so.",
      },
      { question: "How much does custom software cost?", answer: quoteAnswer },
      {
        question: "Do you support the software after launch?",
        answer:
          "Yes. Support after launch is part of how we work. We agree what it covers when we scope your project.",
      },
      {
        question: "Can you work with the system we already have?",
        answer:
          "Often, yes. We look at what you have during the discovery step and tell you honestly whether to connect to it or replace it.",
      },
    ],
  },
];

export function getService(slug: string): Service {
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export const generalFaqs = [
  {
    question: "Do you give free quotes?",
    answer: "Yes. Tell us what you need and we will send you a free quote.",
  },
  {
    question: "Which is the best way to reach you?",
    answer: "Whichever suits you. WhatsApp is the quickest way to send us details, and you are welcome to call or email.",
  },
  {
    question: "How do you keep a project on track?",
    answer:
      "Every project follows the same six steps, from discovery to support. You get a clear scope and timeline before work starts, and updates as we go.",
  },
  {
    question: "Do you help after the launch?",
    answer: "Yes. We stay with you after launch to keep things running and help you add what comes next.",
  },
  {
    question: "Where are you based?",
    answer: "We are based in Sri Lanka.",
  },
];
