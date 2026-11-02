/**
 * The tools this company builds with: what this website is built with, plus Java, Python,
 * Three.js, PostgreSQL and MongoDB, which the owner listed. Add any others here and they
 * appear on the Technology page.
 */
export const techGroups = [
  {
    title: "What people see",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    body: "Pages that load quickly, work on any device and are easy for search engines to read.",
  },
  {
    title: "What runs behind it",
    tools: ["Laravel", "PHP", "Node.js", "Java", "Python"],
    body: "Proven ways to handle logins, business rules and your data safely, picked to suit each project.",
  },
  {
    title: "Admin panels",
    tools: ["Filament"],
    body: "Clean admin panels, so your team can manage content without touching any code.",
  },
  {
    title: "Where your data lives",
    tools: ["MySQL", "PostgreSQL", "MongoDB"],
    body: "Dependable, widely supported databases, matched to your data, so you are never stuck with one hosting company.",
  },
  {
    title: "Motion and 3D",
    tools: ["Three.js", "WebGL", "CSS animation"],
    body: "Used where it helps your brand, and built so that slower phones still get a fast page.",
  },
] as const;

/**
 * The two moving rows on the home page. To add a tool, add its name here and its logo in
 * public/images/tech-logos.svg.
 */
export const techBandRows = [
  ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS", "Three.js", "WebGL"],
  ["Laravel", "PHP", "Node.js", "Java", "Python", "Filament", "MySQL", "PostgreSQL", "MongoDB"],
] as const;

export const techPrinciples = [
  {
    title: "Proven before new",
    body: "We choose tools with a long record and a large community, so your software is not left behind when a trend moves on.",
  },
  {
    title: "Easy to hand over",
    body: "Clean code on widely used tools means another developer can pick it up. You should never feel trapped.",
  },
  {
    title: "The right size for the job",
    body: "If a simple site does what you need, we will not build a complicated one. Less to run means less to go wrong.",
  },
] as const;

export const techStandards = [
  {
    key: "speed",
    title: "Speed",
    body: "Compressed images, as little code as possible, and pages prepared ahead of time so they open quickly.",
  },
  {
    key: "security",
    title: "Security",
    body: "HTTPS, security headers, safe forms and careful checks on anything people upload.",
  },
  {
    key: "search",
    title: "Search",
    body: "Clear titles, structured data and a sitemap, so search engines can understand your site.",
  },
  {
    key: "phones",
    title: "Phones first",
    body: "Designed for small screens first, then tablets and computers.",
  },
  {
    key: "access",
    title: "Accessibility",
    body: "Good contrast, logical headings and full keyboard support, so more people can use it.",
  },
  {
    key: "updates",
    title: "Easy updates",
    body: "Anything you change often goes in an admin panel, not in the code.",
  },
] as const;
