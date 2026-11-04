import Link from "next/link";
import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { ArrowRight, Check } from "@/components/ui/icons";
import { industryIcons } from "@/components/ui/industryIcons";
import { industries } from "@/lib/industries";
import { pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Who We Help: Software by Industry",
  description:
    "Websites, web apps and custom software that CodeRoot Solutions can build for shops, clinics, schools, restaurants and professional services in Sri Lanka.",
  path: "/industries",
  keywords: [
    "websites for small businesses Sri Lanka",
    "software for shops",
    "software for clinics",
    "software for schools",
    "restaurant website",
    "websites for professional services",
  ],
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Who we help" title="Software for the way your business works" crumbs={[{ name: "Who we help", path: "/industries" }]} shapes={["storefront"]}>
        Different businesses, similar problems: too much manual work, and customers who want to do more online. Here is what we can build for yours.
      </PageHero>

      <section className="section-y" aria-labelledby="industries-heading">
        <div className="shell">
          <SectionHead id="industries-heading" eyebrow="Examples" title="What this could look like for you" />
          <p className="mt-6 max-w-3xl rounded-xl border-l-4 border-teal bg-teal-light p-5 text-charcoal" data-reveal>
            We are a new company, so these are examples of what we can build, not a list of past clients. Real work will appear on
            our{" "}
            <Link href="/projects" className="font-semibold underline underline-offset-2">
              projects page
            </Link>{" "}
            as each one goes live.
          </p>

          <ul className="mt-10 grid gap-6 lg:grid-cols-2">
            {industries.map((industry, index) => {
              const Icon = industryIcons[industry.icon];
              const service = getService(industry.service);
              return (
                <li key={industry.slug} id={industry.slug} className="scroll-mt-24" data-reveal style={{ "--i": index % 2 } as React.CSSProperties}>
                  <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 sm:p-8" data-tilt>
                    <span className="grid size-14 place-items-center rounded-xl bg-teal-light text-teal-deep">
                      <Icon className="size-7" />
                    </span>
                    <h3 className="mt-5 text-2xl sm:text-3xl">{industry.title}</h3>
                    <p className="mt-3 text-slate">
                      <span className="font-semibold text-charcoal">A common problem: </span>
                      {industry.problem}
                    </p>
                    <p className="mt-5 font-semibold">What we can build</p>
                    <ul className="mb-6 mt-2.5 space-y-2.5">
                      {industry.builds.map((item) => (
                        <li key={item} className="flex gap-3">
                          <Check className="mt-0.5 size-5 flex-none text-teal-deep" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/services/${service.slug}`} className="group mt-auto inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep">
                      {service.nav} for {industry.title.toLowerCase()}
                      <ArrowRight className="arrow size-5" />
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="other-heading">
        <div className="shell">
          <SectionHead
            id="other-heading"
            tone="tint"
            eyebrow="Not on the list?"
            title="Most problems look familiar"
            lead="If people in your business type the same thing twice, chase information across chats and spreadsheets, or turn customers away because something cannot be done online, we can probably help."
          />
          <div className="mt-10">
            <LinkCards
              onTint
              items={[
                { href: "/services", label: "See what we build", body: "Compare websites, web apps and custom software." },
                { href: "/insights/custom-software-or-ready-made", label: "Custom or ready made?", body: "An honest guide to which one suits your business." },
              ]}
            />
          </div>
        </div>
      </section>

      <SimpleCta title="Tell us about your business" />
    </>
  );
}
