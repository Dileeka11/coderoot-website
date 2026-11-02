export type ArticleBlock = { type: "p" | "h2"; text: string } | { type: "ul"; items: string[] };

export interface Article {
  slug: string;
  title: string;
  /** Used in lists and in search results */
  summary: string;
  category: string;
  /** The date this was really written. Brand rule: never invent dates. */
  published: string;
  blocks: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "website-or-web-app",
    title: "Website or web app: which does your business need?",
    summary:
      "The difference is simple: a website tells people things, and a web app lets them do things. Here is how to work out which one you need.",
    category: "Getting started",
    published: "2026-11-02",
    blocks: [
      {
        type: "p",
        text: "People often use these two words as if they mean the same thing. They do not, and the difference affects what you should ask for, how long it takes and what it costs.",
      },
      { type: "h2", text: "A website gives people information" },
      {
        type: "p",
        text: "A website explains who you are, what you offer and how to reach you. Most visitors read a few pages, then call, send a message or visit you. A company site, a restaurant menu and a portfolio are all websites.",
      },
      { type: "h2", text: "A web app lets people do something" },
      {
        type: "p",
        text: "A web app opens in a browser just like a website, but people use it to get something done: book an appointment, check an order, manage stock or approve a leave request. It stores information, and what it shows depends on who is using it.",
      },
      { type: "h2", text: "Four questions that settle it" },
      {
        type: "ul",
        items: [
          "Do people need to log in? If yes, you probably need a web app.",
          "Will people enter information that you need to keep and use later? That also points to a web app.",
          "Does what they see depend on who they are? A customer sees their own orders, and your staff see everyone's. That is a web app.",
          "Is the main goal to be found and contacted? Then a website is probably all you need.",
        ],
      },
      { type: "h2", text: "You may end up with both" },
      {
        type: "p",
        text: "Many businesses do. The website brings customers in, and the web app looks after them once they are there. You do not have to build both at once. Start with whatever helps most right now, and make sure it can grow later.",
      },
      { type: "h2", text: "Still not sure?" },
      {
        type: "p",
        text: "Tell us what you want people to be able to do. We will tell you which one fits, including when something simpler or ready-made would do the job.",
      },
    ],
  },
  {
    slug: "prepare-for-a-website-quote",
    title: "What to prepare before you ask for a website quote",
    summary:
      "A better brief gets you a more accurate quote and fewer surprises. Here is what to have ready, and what you can leave to your developer.",
    category: "Getting started",
    published: "2026-11-02",
    blocks: [
      {
        type: "p",
        text: "You do not need a technical document to ask for a quote. A little preparation still helps, because the clearer your request is, the closer the quote will be to what the work really involves.",
      },
      { type: "h2", text: "Decide what the website is for" },
      {
        type: "p",
        text: "Pick its main job. Do you want more phone calls, online sales, bookings, or just a professional place to send people? One clear goal makes every later decision easier.",
      },
      { type: "h2", text: "List the pages you think you need" },
      {
        type: "p",
        text: "A rough list is fine: home, services, about, contact. It does not have to be final, and a good developer will suggest changes. It simply shows the size of what you have in mind.",
      },
      { type: "h2", text: "Collect a few examples" },
      {
        type: "p",
        text: "Find two or three websites you like, and note what you like about them. They do not have to be in your industry. Examples often explain more than a long description can.",
      },
      { type: "h2", text: "Gather what you already have" },
      {
        type: "ul",
        items: [
          "Your logo and brand colours",
          "Photos of your work, products or team",
          "Text you already use, such as a company profile",
          "Login details for your domain and hosting, if you have them",
        ],
      },
      { type: "h2", text: "Think about who will keep it updated" },
      {
        type: "p",
        text: "If you will change prices, products or news often, say so. That is the difference between a simple site and one with an admin panel, and it is better planned at the start.",
      },
      { type: "h2", text: "Share your date and your budget" },
      {
        type: "p",
        text: "If you have a launch date, mention it. If you have a budget in mind, sharing it helps too, because it lets your developer suggest what makes sense for that amount, instead of guessing.",
      },
      { type: "h2", text: "Questions worth asking" },
      {
        type: "ul",
        items: [
          "What exactly is included, and what would cost extra?",
          "Who owns the website and the domain when it is finished?",
          "How will I update the content?",
          "What happens if something goes wrong after launch?",
        ],
      },
      {
        type: "p",
        text: "Any good developer will be happy to answer these. If you are ready, our quote form walks you through the same points in a couple of minutes.",
      },
    ],
  },
  {
    slug: "custom-software-or-ready-made",
    title: "Custom software or ready-made? How to decide",
    summary:
      "Ready-made tools are often the right answer. Custom software earns its place when they start to hold your business back.",
    category: "Software decisions",
    published: "2026-11-02",
    blocks: [
      {
        type: "p",
        text: "We build custom software, and we will still tell you this: if a ready-made tool does what you need, use it. Custom software is worth it in some situations, not all of them.",
      },
      { type: "h2", text: "When ready-made is the better choice" },
      {
        type: "p",
        text: "Ready-made tools are quick to start, cost less at the beginning and are maintained by someone else. For common jobs like accounting, email or simple online forms, they are usually the sensible choice.",
      },
      { type: "h2", text: "Signs you have outgrown it" },
      {
        type: "ul",
        items: [
          "Your team types the same information into two or three places.",
          "Part of your business still runs on spreadsheets alongside the tool.",
          "You have changed how you work to fit the software, and it costs you time.",
          "Reports you need take hours to put together by hand.",
          "You pay for many features you never use, and still miss the one you need.",
        ],
      },
      { type: "h2", text: "What custom software gives you" },
      {
        type: "p",
        text: "It fits how your business already works, connects the tools you use, and shows the information you need in one place. It can also change as you grow, because you decide what gets added and when.",
      },
      { type: "h2", text: "What it asks of you" },
      {
        type: "p",
        text: "Be honest about the other side. It costs more at the start, it takes time for you to explain how your business works, and it needs looking after once it is live. A developer who does not mention this is not telling you the whole story.",
      },
      { type: "h2", text: "There is a middle path" },
      {
        type: "p",
        text: "You often do not have to choose one or the other. Keep the ready-made tools that work, and build only the part that is missing, or connect them so information moves on its own. It is usually the cheapest way to fix the problem you really have.",
      },
    ],
  },
  {
    slug: "why-your-website-is-slow",
    title: "Why your website feels slow, and what actually helps",
    summary:
      "Most slow websites have the same few causes, and most of them can be fixed without starting again.",
    category: "Websites",
    published: "2026-11-02",
    blocks: [
      {
        type: "p",
        text: "A slow website loses people before they read a word. The good news is that the causes are usually ordinary, and you do not always need a new site to fix them.",
      },
      { type: "h2", text: "Images that are far too big" },
      {
        type: "p",
        text: "This is the most common cause. A photo straight from a camera can be many times larger than the space it fills on screen. Resizing images and saving them in a modern format such as WebP often makes the biggest difference for the least work.",
      },
      { type: "h2", text: "Too many add-ons" },
      {
        type: "p",
        text: "Every plugin, chat widget and tracking script adds code that the visitor's phone has to download and run. Each one seems small, but they add up. Remove what you do not really use.",
      },
      { type: "h2", text: "Hosting that cannot keep up" },
      {
        type: "p",
        text: "If the very first response from your server is slow, nothing on the page can make up for it. The cheapest hosting is sometimes a false saving, especially for a site that is doing real work.",
      },
      { type: "h2", text: "Heavy effects without a plan" },
      {
        type: "p",
        text: "Video backgrounds and big animations can look great, but they should be built so that slower phones still get a fast page. Motion should never be the reason someone leaves.",
      },
      { type: "h2", text: "How to check yours" },
      {
        type: "ul",
        items: [
          "Open your site on an ordinary phone, on mobile data, not on your office Wi-Fi.",
          "Run it through Google's free PageSpeed Insights tool and read what it suggests.",
          "Ask someone who has never seen it to find your phone number, and watch how long it takes.",
        ],
      },
      { type: "h2", text: "What to fix first" },
      {
        type: "p",
        text: "Start with images, then remove what you do not need, then look at hosting. If the site is still slow after that, the way it was built may be the real problem, and that is when a rebuild starts to make sense.",
      },
    ],
  },
  {
    slug: "after-your-website-goes-live",
    title: "What happens after your website goes live",
    summary:
      "Launch is the start, not the finish. Here is what a website needs to stay safe, fast and useful for your business.",
    category: "Websites",
    published: "2026-11-02",
    blocks: [
      {
        type: "p",
        text: "It is easy to think a website is done once it is online. In practice, launch is when it starts working for you, and like anything that works, it needs a little looking after.",
      },
      { type: "h2", text: "Keep it secure" },
      {
        type: "p",
        text: "The software behind a website gets security updates, and those need to be applied. Your domain name and hosting also need renewing on time. A lapsed domain can take your whole site and your email offline.",
      },
      { type: "h2", text: "Keep backups, and test them" },
      {
        type: "p",
        text: "Make sure someone takes regular backups, and that they are stored away from the website itself. A backup only counts if it has been restored at least once.",
      },
      { type: "h2", text: "Keep the content current" },
      {
        type: "p",
        text: "Old prices and an old phone number make people doubt everything else on the page. Set a reminder to read through your site every few months, as if you were a new customer.",
      },
      { type: "h2", text: "Help people find you" },
      {
        type: "ul",
        items: [
          "Add your site to Google Search Console, so you can see how people find it.",
          "Set up your Google Business Profile, especially if customers visit you in person.",
          "Link to your website from your social media pages.",
        ],
      },
      { type: "h2", text: "Improve it in small steps" },
      {
        type: "p",
        text: "Your customers will show you what is missing. If they keep asking the same question, answer it on the site. Small improvements made regularly do more than a big redesign every few years.",
      },
      { type: "h2", text: "Agree who does what" },
      {
        type: "p",
        text: "Before launch, decide who handles updates, backups, renewals and fixes. Whether that is your team or your developer matters less than everyone knowing it is their job.",
      },
    ],
  },
];

export function getArticle(slug: string): Article {
  const article = articles.find((item) => item.slug === slug);
  if (!article) throw new Error(`Unknown article: ${slug}`);
  return article;
}

const WORDS_PER_MINUTE = 200;

export function readingMinutes(article: Article) {
  const words = article.blocks
    .flatMap((block) => (block.type === "ul" ? block.items : [block.text]))
    .join(" ")
    .split(/\s+/).length;
  return Math.ceil(words / WORDS_PER_MINUTE);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
