import Link from "next/link";
import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { ArrowRight, Clock, Code, Sprout } from "@/components/ui/icons";
import { FlipWords } from "@/components/ui/FlipWords";
import { pageMetadata } from "@/lib/seo";
import { processSteps, site, values } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "CodeRoot Solutions is a software company in Sri Lanka. We build reliable software, websites and digital solutions that help businesses grow.",
  path: "/about",
});

const honest = [
  {
    title: "No made-up numbers",
    body: "You will not find invented client counts or made-up reviews here. Our projects page grows with real work, added as each one goes live.",
  },
  {
    title: "Your project matters",
    body: "Every project we take on helps build our name, so we have every reason to do it well and to look after you afterwards.",
  },
  {
    title: "Modern from day one",
    body: "We started with today's tools and good habits, so we have no old systems to work around.",
  },
];

const promises = [
  { Icon: Code, title: "Clean code", body: "Easy to read, easy to change, and still working years from now." },
  { Icon: Clock, title: "Clear timelines", body: "You know the scope and the dates before work starts." },
  { Icon: Sprout, title: "Support after launch", body: "We do not disappear when the site goes live. We stay and help you grow." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Rooted in code. Built to grow." crumbs={[{ name: "About us", path: "/about" }]} shapes={["tree"]}>
        {site.purpose}
      </PageHero>

      <section className="section-y">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 className="display heading-xl" data-flip>
            <FlipWords text="A software company for growing businesses" />
          </h2>
          <div className="space-y-5 text-lg text-slate" data-reveal>
            <p>
              CodeRoot Solutions is a software company in Sri Lanka, launched in November 2026. We build
              websites, web apps and custom software for businesses that are ready to grow.
            </p>
            <p>
              Our name says how we work. Good software, like a strong tree, depends on what is under the
              surface. So we write clean code, plan clear timelines and stay with you after launch.
            </p>
          </div>
        </div>
      </section>

      <section className="below-fold bg-charcoal text-white section-y" aria-labelledby="promises-heading">
        <div className="shell">
          <SectionHead id="promises-heading" tone="dark" eyebrow="What we promise" title="Three things you can hold us to" />
          <ul className="mt-12 grid gap-10 md:grid-cols-3">
            {promises.map(({ Icon, title, body }, index) => (
              <li key={title} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <span className="grid size-14 place-items-center rounded-xl bg-graphite text-teal">
                  <Icon className="size-7" />
                </span>
                <h3 className="mt-5 text-2xl">{title}</h3>
                <p className="mt-2 text-mist">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="honest-heading">
        <div className="shell">
          <SectionHead
            id="honest-heading"
            eyebrow="Being new"
            title="We are new, and we will not pretend otherwise"
            lead="We launched in November 2026, so there is no wall of logos here. What we can show you is how we work, and this website itself."
          />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {honest.map((item, index) => (
              <li key={item.title} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <div className="h-full rounded-2xl border border-line bg-white p-7" data-tilt>
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="mt-2 text-slate">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="values-heading">
        <div className="shell">
          <SectionHead id="values-heading" tone="tint" eyebrow="What we value" title="How we like to work" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <li key={value.title} data-reveal style={{ "--i": index % 3 } as React.CSSProperties}>
                <div className="h-full rounded-2xl bg-white p-7" data-tilt>
                  <h3 className="text-2xl">{value.title}</h3>
                  <p className="mt-2 text-slate">{value.body}</p>
                  <p className="mt-3 border-t border-line pt-3 text-[0.9375rem] font-medium">{value.practice}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="path-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <SectionHead id="path-heading" title="From first chat to long-term support" className="max-w-3xl" />
            <Link href="/how-we-work" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep">
              See each step in detail
              <ArrowRight className="arrow size-5" />
            </Link>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-line p-6"
                data-reveal
                style={{ "--i": index % 3 } as React.CSSProperties}
              >
                <span className="font-display text-lg font-bold text-teal-deep">0{index + 1}</span>
                <h3 className="mt-2 text-xl">{step.title}</h3>
                <p className="mt-2 text-slate">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-label="Keep reading">
        <div className="shell">
          <LinkCards
            onTint
            items={[
              { href: "/technology", label: "The tools we use", body: "What we build with and why, in plain words." },
              { href: "/industries", label: "Who we help", body: "What we can build for businesses like yours." },
              { href: "/insights", label: "Insights", body: "Plain-language guides for business owners." },
            ]}
          />
        </div>
      </section>

      <SimpleCta title="Let's build something that lasts" />
    </>
  );
}
