import { JsonLd, faqSchema } from "@/components/seo/JsonLd";
import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { Faq } from "@/components/ui/Faq";
import { Check } from "@/components/ui/icons";
import { faqGroups } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";
import { processSteps, proposalSections } from "@/lib/site";

export const metadata = pageMetadata({
  title: "How We Work: Our Six Step Process",
  description:
    "How CodeRoot Solutions runs a project, from the first chat to support after launch: what happens at each step, what you get and what we need from you.",
  path: "/how-we-work",
  keywords: [
    "web development process",
    "software development process",
    "website project steps",
    "UI UX design and development",
  ],
});

const habits = [
  {
    title: "Everything in writing",
    body: "The scope, the timeline and the cost are agreed on paper before any work starts.",
  },
  {
    title: "Updates without asking",
    body: "You hear from us as the work moves, so you always know where things stand.",
  },
  {
    title: "You see it early",
    body: "You review the designs before we build them, and try finished parts as we go.",
  },
  {
    title: "A checklist before anything reaches you",
    body: "Proposals, designs and finished pages are checked first: accurate details, clear scope, a consistent look and readable text.",
  },
];

const questions = faqGroups.find((group) => group.id === "during-a-project")?.items ?? [];

export default function HowWeWorkPage() {
  return (
    <>
      <JsonLd data={faqSchema(questions)} />

      <PageHero eyebrow="How we work" title="How every project runs, step by step" crumbs={[{ name: "How we work", path: "/how-we-work" }]} shapes={["flow"]}>
        Every project follows the same six steps. You always know what is happening now, what you will get and what comes next.
      </PageHero>

      <section className="section-y" aria-labelledby="steps-heading">
        <div className="shell">
          <SectionHead
            id="steps-heading"
            eyebrow="Step by step"
            title="What happens, and when"
            lead="Here is what each step involves, what you get from it and what we will need from you."
          />

          <ol className="root-line mt-14">
            {processSteps.map((step, index) => (
              <li key={step.title} className="relative pb-14 pl-[calc(var(--node)+1.25rem)] last:pb-0 sm:pl-[calc(var(--node)+2rem)]">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 z-10 grid size-[var(--node)] place-items-center rounded-full bg-charcoal font-display font-bold text-teal sm:text-lg"
                >
                  0{index + 1}
                </span>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12" data-reveal>
                  <div className="sm:pt-2">
                    <h3 className="text-3xl">{step.title}</h3>
                    <p className="mt-1 font-semibold text-teal-deep">{step.short}</p>
                    <p className="mt-3 text-lg text-slate">{step.details}</p>
                  </div>
                  <div className="grid gap-6 rounded-2xl bg-neutral p-6 sm:grid-cols-2 sm:p-7">
                    {[
                      { label: "You get", items: step.youGet },
                      { label: "What we need from you", items: step.fromYou },
                    ].map(({ label, items }) => (
                      <div key={label}>
                        <h4 className="font-display text-sm font-semibold uppercase tracking-[0.14em]">{label}</h4>
                        <ul className="mt-3 space-y-2.5">
                          {items.map((item) => (
                            <li key={item} className="flex gap-2.5 text-[0.9375rem] leading-snug">
                              <Check className="mt-0.5 size-[18px] flex-none text-teal-deep" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="below-fold bg-teal-light section-y" aria-labelledby="proposal-heading">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-20">
          <SectionHead
            id="proposal-heading"
            tone="tint"
            eyebrow="Before work starts"
            title="Your proposal, in plain words"
            lead="After we talk, you get a written proposal. It has the same five parts every time, so you can see what you are getting, compare it and make a decision without any pressure."
          />
          <ol className="overflow-hidden rounded-2xl bg-white shadow-[0_32px_64px_-40px_rgb(30_31_34/0.55)]" data-reveal>
            {proposalSections.map((section, index) => (
              <li key={section.title} className="flex gap-5 border-b border-line p-5 last:border-b-0 sm:p-6">
                <span aria-hidden="true" className="font-display text-lg font-bold text-teal-deep">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-xl">{section.title}</h3>
                  <p className="mt-1 text-slate">{section.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="habits-heading">
        <div className="shell">
          <SectionHead id="habits-heading" eyebrow="Along the way" title="How we keep a project on track" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {habits.map((habit, index) => (
              <li key={habit.title} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <div className="h-full rounded-2xl border border-line bg-white p-7" data-tilt>
                  <h3 className="text-xl">{habit.title}</h3>
                  <p className="mt-2 text-slate">{habit.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="work-faq">
        <div className="shell max-w-4xl">
          <h2 id="work-faq" className="display heading-lg mb-8">
            Common questions
          </h2>
          <Faq items={questions} />
        </div>
      </section>

      <section className="below-fold section-y" aria-label="Keep reading">
        <div className="shell">
          <LinkCards
            items={[
              { href: "/services", label: "What we build", body: "Websites, web apps and custom software, and how to choose between them." },
              { href: "/technology", label: "The tools we use", body: "What we build with and why, explained in plain words." },
              { href: "/faq", label: "More questions", body: "Answers on cost, timing, support and the technical side." },
            ]}
          />
        </div>
      </section>

      <SimpleCta title="Ready for step one?" />
    </>
  );
}
