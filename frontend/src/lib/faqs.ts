const quoteAnswer =
  "Our pricing page shows our packages and what each one includes. The final price depends on what you need, so we send you a free written quote with a clear scope before any work starts.";

interface FaqGroup {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        question: "How do I start?",
        answer:
          "Fill in the quote form, or message us on WhatsApp, Facebook or email. Tell us what you need in your own words. We will reply and talk it through with you.",
      },
      {
        question: "I am not sure what I need. Can you still help?",
        answer:
          "Yes. That is what the first conversation is for. Tell us what you want to happen, and we will suggest what fits. If a simple or ready-made option is the better choice, we will say so.",
      },
      {
        question: "Do I need to understand the technical side?",
        answer: "No. You know your business, and we handle the technology. We explain things in plain words as we go.",
      },
      {
        question: "What do you need from me for a quote?",
        answer:
          "A rough idea of what you want and who it is for. Examples you like, and any date you are working towards, also help. We can work out the rest together.",
      },
    ],
  },
  {
    id: "cost-and-timing",
    title: "Cost and timing",
    items: [
      { question: "How much does it cost?", answer: quoteAnswer },
      {
        question: "Are quotes free?",
        answer: "Yes. Tell us what you need and we will send you a free quote.",
      },
      {
        question: "Why can my final price be different from the package price?",
        answer:
          "A package describes a typical project, and yours may need more or less. Your written quote shows exactly what you are getting and what it costs, and we explain any difference before you decide.",
      },
      {
        question: "What if my project does not fit a package?",
        answer: "That is fine. Tell us what you need and we will quote it on its own.",
      },
      {
        question: "Can I start small and add more later?",
        answer: "Yes. We can start with what you need most, launch it, and add more as your business grows.",
      },
      {
        question: "How long does a project take?",
        answer:
          "It depends on the size of the project. You get a clear timeline with your proposal, before any work starts.",
      },
      {
        question: "How do payments work?",
        answer: "Payment terms are written in your proposal, so you can see them before you agree to anything.",
      },
    ],
  },
  {
    id: "during-a-project",
    title: "During a project",
    items: [
      {
        question: "How will I know how things are going?",
        answer: "We keep you updated as we go, and you can ask us at any time. Every project follows the same six steps, so you always know what comes next.",
      },
      {
        question: "What if I want to change something?",
        answer:
          "Tell us. Changes are easiest during design, which is why we show you the designs before we build. If a change affects the scope, we explain what it means for the timeline and cost before doing it.",
      },
      {
        question: "Can you work with what I already have?",
        answer:
          "Often, yes. We look at your current website or system during the discovery step, and tell you honestly whether to keep it, connect to it or replace it.",
      },
      {
        question: "Do you work with businesses across Sri Lanka?",
        answer: "Yes. We can talk by phone, WhatsApp or email, wherever you are in Sri Lanka.",
      },
    ],
  },
  {
    id: "after-launch",
    title: "After launch",
    items: [
      {
        question: "Do you help after the launch?",
        answer: "Yes. We stay with you after launch to keep things running and help you add what comes next.",
      },
      {
        question: "What does support cover?",
        answer: "It depends on what we build for you. We agree what it covers while we plan your project, so there are no surprises.",
      },
      {
        question: "Can I update the website myself?",
        answer: "Yes, if you need to. We can add an admin panel so your team can change content without touching any code.",
      },
      {
        question: "Who owns the finished work?",
        answer: "Ownership is written in your proposal, so it is clear before any work starts. If you have a question about it, please ask.",
      },
    ],
  },
  {
    id: "technical",
    title: "Technical questions",
    items: [
      {
        question: "Will it work on phones?",
        answer: "Yes. We design for phones first, then test on phones, tablets and computers before launch.",
      },
      {
        question: "Will my website show up on Google?",
        answer:
          "We set up the technical side properly so search engines can read your site. Where it ranks also depends on your content and your competition, so we will not promise a position.",
      },
      {
        question: "Is it secure?",
        answer:
          "Security is part of every project: HTTPS, security headers, safe forms and careful checks on uploads. Nobody can honestly promise perfect security, so we also keep things updated after launch.",
      },
      {
        question: "What technology do you use?",
        answer:
          "Mainly Next.js and React for what people see, Laravel, Node.js, Java or Python for what runs behind it, MySQL, PostgreSQL or MongoDB for data, and Three.js for 3D. Our Technology page explains why, in plain words.",
      },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((group) => group.items);
