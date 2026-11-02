import Link from "next/link";
import { JsonLd, faqSchema, organizationId } from "@/components/seo/JsonLd";
import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { ArrowRight, Check } from "@/components/ui/icons";
import { ToolChips } from "@/components/ui/ToolChips";
import { pricedSlugs } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { services, type Service } from "@/lib/services";
import { processSteps, site } from "@/lib/site";

export function serviceMetadata(service: Service) {
  return pageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export function ServicePage({ service }: { service: Service }) {
  const path = `/services/${service.slug}`;
  const quoteLink = `/quote?need=${service.slug}`;
  const others = services.filter((item) => item.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.nav,
          serviceType: service.nav,
          description: service.seoDescription,
          url: `${site.url}${path}`,
          provider: { "@id": organizationId },
          areaServed: { "@type": "Country", name: site.address.country },
        }}
      />
      <JsonLd data={faqSchema(service.faqs)} />

      <PageHero
        eyebrow={service.nav}
        title={service.seoTitle}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.nav, path },
        ]}
        shapes={[service.shape]}
      >
        {service.intro}
      </PageHero>

      <section className="section-y" aria-labelledby="builds-heading">
        <div className="shell">
          <SectionHead id="builds-heading" eyebrow="What we can build" title={`${service.title} for your business`} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.builds.map((item, index) => (
              <li key={item.title} data-reveal style={{ "--i": index % 3 } as React.CSSProperties}>
                <div className="h-full rounded-2xl border border-line bg-white p-7" data-tilt>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-2 text-slate">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="includes-heading">
        <div className="shell grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <h2 id="includes-heading" className="display heading-lg" data-reveal>
              What you get
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.includes.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl bg-white p-5"
                  data-reveal
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <Check className="mt-0.5 size-5 flex-none text-teal-deep" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <aside className="h-fit rounded-2xl bg-teal-light p-7 sm:p-8" data-reveal>
            <h2 className="text-2xl">A good fit for</h2>
            <ul className="mt-5 space-y-3">
              {service.goodFor.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 size-5 flex-none text-teal-deep" />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href={quoteLink} variant="dark" arrow className="mt-7">
              Get a free quote
            </ButtonLink>
          </aside>
        </div>
      </section>

      <section className="below-fold bg-charcoal text-white section-y" aria-labelledby="focus-heading">
        <div className="shell">
          <SectionHead id="focus-heading" tone="dark" eyebrow="Where we put the effort" title="What matters most here" />
          <ol className="mt-10 grid gap-8 lg:grid-cols-3">
            {service.focus.map((item, index) => (
              <li key={item.title} className="border-t-2 border-teal pt-5" data-reveal style={{ "--i": index } as React.CSSProperties}>
                <h3 className="text-2xl">{item.title}</h3>
                <p className="mt-2 text-mist">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="tools-heading">
        <div className="shell flex flex-wrap items-center justify-between gap-x-12 gap-y-5">
          <div>
            <h2 id="tools-heading" className="text-2xl" data-reveal>
              Tools we use for this
            </h2>
            <ToolChips tools={service.tools} className="mt-4" />
          </div>
          <Link href="/technology" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep">
            Why we chose these tools
            <ArrowRight className="arrow size-5" />
          </Link>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="steps-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2 id="steps-heading" className="display heading-lg" data-reveal>
              How it works
            </h2>
            <Link href="/how-we-work" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-charcoal">
              See each step in detail
              <ArrowRight className="arrow size-5" />
            </Link>
          </div>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl bg-white p-6"
                data-reveal
                style={{ "--i": index } as React.CSSProperties}
              >
                <span className="font-display text-lg font-bold text-teal-deep">0{index + 1}</span>
                <h3 className="mt-2 text-xl">{step.title}</h3>
                <p className="mt-2 text-slate">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="faq-heading">
        <div className="shell max-w-4xl">
          <h2 id="faq-heading" className="display heading-lg mb-8">
            Common questions
          </h2>
          <Faq items={service.faqs} />
          {pricedSlugs.includes(service.slug) && (
            <Link href={`/pricing#${service.slug}`} className="group mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep">
              See the packages for {service.title.toLowerCase()}
              <ArrowRight className="arrow size-5" />
            </Link>
          )}
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="others-heading">
        <div className="shell">
          <h2 id="others-heading" className="display heading-lg mb-8" data-reveal>
            Our other services
          </h2>
          <LinkCards
            onTint
            items={others.map((item) => ({ href: `/services/${item.slug}`, label: item.nav, body: item.short }))}
          />
        </div>
      </section>

      <SimpleCta href={quoteLink} />
    </>
  );
}
