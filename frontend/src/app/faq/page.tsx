import { JsonLd, faqSchema } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { SimpleCta } from "@/components/site/SimpleCta";
import { Faq } from "@/components/ui/Faq";
import { allFaqs, faqGroups } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about working with CodeRoot Solutions: getting started, cost and timing, what happens during a project, and support after launch.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(allFaqs)} />

      <PageHero eyebrow="FAQ" title="Questions people ask us" crumbs={[{ name: "FAQ", path: "/faq" }]} shapes={["question"]}>
        Straight answers about cost, timing, how we work and what happens after launch.
      </PageHero>

      <section className="section-y">
        <div className="shell grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Topics" className="h-fit lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-slate">Topics</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-1">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="inline-flex min-h-11 items-center rounded-lg border border-line px-3.5 font-medium transition-colors duration-200 hover:border-teal-deep hover:text-teal-deep lg:border-transparent lg:px-0"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-14">
            {faqGroups.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-24">
                <h2 id={`${group.id}-heading`} className="display heading-lg mb-6">
                  {group.title}
                </h2>
                <Faq items={group.items} />
              </section>
            ))}
          </div>
        </div>
      </section>

      <SimpleCta title="Still have a question?" href="/contact" />
    </>
  );
}
