/**
 * Company facts in one place. Everything here comes from the brand kit or the company's
 * Facebook page. Brand rule: never invent prices, dates or client details.
 */
export const site = {
  name: "CodeRoot Solutions",
  shortName: "CodeRoot",
  tagline: "Rooted in Code. Built to Grow.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://coderootsolutions.com").replace(/\/$/, ""),
  description:
    "CodeRoot Solutions builds websites, web apps and custom software for growing businesses in Sri Lanka: clean code, clear timelines and support after launch.",
  purpose: "We build reliable software, websites and digital solutions that help businesses grow.",
  email: "info@coderootsolutions.com",
  phone: {
    display: "074 223 4641",
    international: "+94 74 223 4641",
    href: "tel:+94742234641",
  },
  whatsapp: {
    number: "94742234641",
    href: "https://wa.me/94742234641",
  },
  address: {
    street: "138/6/A",
    postalCode: "70620",
    country: "Sri Lanka",
    countryCode: "LK",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61595916968916",
    instagram: "https://www.instagram.com/coderootsolutions",
    linkedin: "https://www.linkedin.com/company/144076112/",
    tiktok: "https://tiktok.com/@coderoot.solution",
  },
} as const;

export interface NavChild {
  href: string;
  label: string;
  note: string;
}

export interface NavItem {
  href: string;
  label: string;
  children?: readonly NavChild[];
}

export const navigation: readonly NavItem[] = [
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/website-development", label: "Website development", note: "Clear, fast sites for your business" },
      { href: "/services/web-application-development", label: "Web app development", note: "Online tools for your team and customers" },
      { href: "/services/custom-software-development", label: "Custom software", note: "Built around how your business works" },
      { href: "/services", label: "All services", note: "Compare them and see which one you need" },
    ],
  },
  { href: "/projects", label: "Projects" },
  { href: "/pricing", label: "Pricing" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "About us", note: "Who we are and what we value" },
      { href: "/how-we-work", label: "How we work", note: "The same six clear steps, every project" },
      { href: "/technology", label: "Technology", note: "The tools we build with, and why" },
      { href: "/industries", label: "Who we help", note: "What we can build for businesses like yours" },
    ],
  },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  company: [
    { href: "/about", label: "About us" },
    { href: "/how-we-work", label: "How we work" },
    { href: "/technology", label: "Technology" },
    { href: "/industries", label: "Who we help" },
    { href: "/projects", label: "Projects" },
  ],
  resources: [
    { href: "/pricing", label: "Pricing" },
    { href: "/insights", label: "Insights" },
    { href: "/faq", label: "FAQ" },
    { href: "/quote", label: "Get a free quote" },
    { href: "/contact", label: "Contact us" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms of use" },
  ],
} as const;

/** The six-step workflow from the brand guidelines */
export const processSteps = [
  {
    title: "Discover",
    short: "Goals and needs",
    body: "We learn about your business, your goals and what you need the software to do.",
    details:
      "We start by listening. We ask what your business does, who will use the software and what is getting in the way today. If something ready made would suit you better, we will tell you.",
    youGet: ["A clear summary of what you need", "Honest advice on the best way forward"],
    fromYou: ["A conversation about your goals", "Any examples you like, and any systems you use now"],
  },
  {
    title: "Plan",
    short: "Scope and quote",
    body: "You get a clear scope, a timeline and a written quote before any work starts.",
    details:
      "We turn that conversation into a written proposal, so you can see exactly what you are getting before you commit to anything.",
    youGet: ["A written proposal with the scope and timeline", "A free quotation"],
    fromYou: ["Your questions and feedback on the scope", "Your approval to start"],
  },
  {
    title: "Design",
    short: "UI/UX design",
    body: "We design the screens and how people move through them, then check them with you.",
    details:
      "We design the main screens and how people move between them, using your brand. You see it and can change it before we build it, while changes are still easy.",
    youGet: ["Screen designs to review", "A chance to change things before development starts"],
    fromYou: ["Your logo and brand details, if you have them", "Your feedback on the designs"],
  },
  {
    title: "Develop",
    short: "Clean code",
    body: "We build it with clean code that is easy to maintain, and keep you updated as we go.",
    details:
      "We build in small steps and keep you updated, so there are no surprises at the end. The code is written to be easy to read and change, because one day you will want to change it.",
    youGet: ["Regular progress updates", "Finished parts to try as we go"],
    fromYou: ["Your content: text, photos and product details", "Quick answers when we have a question"],
  },
  {
    title: "Test & Launch",
    short: "QA and deploy",
    body: "We test across devices, fix what we find and put it live.",
    details:
      "We test on phones, tablets and computers, fix what we find, and check speed and security. When you are happy with it, we put it live.",
    youGet: ["A tested product, live and ready to use", "A walkthrough of how to use it"],
    fromYou: ["A final check and your approval", "Access to your domain and hosting, if you already have them"],
  },
  {
    title: "Support",
    short: "Maintain and grow",
    body: "We stay with you after launch to keep things running and help you add what comes next.",
    details:
      "We do not disappear after launch. We keep things running and help you add what comes next. What support covers is agreed during planning, so you know what to expect.",
    youGet: ["Help when something needs attention", "Advice on what to improve next"],
    fromYou: ["Tell us what is working and what is not", "Your ideas for what comes next"],
  },
] as const;

/** The sections of the brand kit's proposal template, explained in plain words */
export const proposalSections = [
  { title: "Overview", body: "Your goals and the problem we are solving, in plain words." },
  { title: "Scope of work", body: "Exactly what we will build, so nothing is left to guesswork." },
  { title: "Timeline", body: "The steps, and when each one should be finished." },
  { title: "Investment", body: "What it costs and what that covers." },
  { title: "Next steps", body: "What happens once you say yes." },
] as const;

/** Brand personality from the guidelines, explained in plain words */
export const values = [
  {
    title: "Innovative",
    body: "We look for the simplest modern way to solve your problem.",
    practice: "New tools only when they make your project better, not because they are new.",
  },
  {
    title: "Reliable",
    body: "We say what we will do, and then we do it. Clean code is part of that.",
    practice: "If something is going to change, you hear it from us first.",
  },
  {
    title: "Professional",
    body: "Clear scope, clear timelines and honest updates along the way.",
    practice: "What we agree is written down, so nobody has to rely on memory.",
  },
  {
    title: "Approachable",
    body: "You can ask anything. We explain things without the jargon.",
    practice: "No question is too basic. You should always understand what you are paying for.",
  },
  {
    title: "Growth-focused",
    body: "We build so your software can grow with your business.",
    practice: "We start with what you need now, and leave room for what comes next.",
  },
] as const;
