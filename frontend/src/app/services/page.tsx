import Link from "next/link";
import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { ArrowRight, Check } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";

const description =
  "Website development, web application development and custom software for growing businesses in Sri Lanka. Clean code, clear timelines and support after launch.";

export const metadata = pageMetadata({
  title: "Web Development Services in Sri Lanka",
  description,
  path: "/services",
  keywords: [
    "web development services Sri Lanka",
    "web design services Sri Lanka",
    "software development services Sri Lanka",
    "website development Sri Lanka",
    "web application development Sri Lanka",
    "custom software development Sri Lanka",
  ],
});

const compare = [
  {
    label: "Its main job",
    values: ["Tells people about you and brings in enquiries", "Lets people do something online", "Runs part of your business"],
  },
  {
    label: "Who mostly uses it",
    values: ["Anyone looking for what you offer", "Your customers, your team or both", "Mainly your team"],
  },
  { label: "Do people log in?", values: ["Usually not", "Yes", "Yes"] },
  {
    label: "Examples",
    values: ["Company site, online store, landing page", "Customer portal, booking system, dashboard", "Stock system, billing tool, staff records"],
  },
  {
    label: "Start here if",
    values: ["You need to be found and contacted", "People should be able to do things online", "Manual work is costing you time every week"],
  },
];

const included = [
  { title: "A free quote", body: "You see the scope and the cost before you decide anything." },
  { title: "A clear timeline", body: "You know the dates before work starts, and we keep you updated." },
  { title: "Design for your brand", body: "Made for your business, and checked with you before we build it." },
  { title: "Every screen covered", body: "Tested on phones, tablets and computers before launch." },
  { title: "Speed and security", body: "Built in from the start, not added at the end." },
  { title: "Support after launch", body: "We stay with you to keep things running and help you add what comes next." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Software that fits your business" crumbs={[{ name: "Services", path: "/services" }]} shapes={["browser", "stack", "gear"]}>
        We build websites, web apps and custom software. Start with what you need today, and add more when you are ready.
      </PageHero>

      <section className="section-y">
        <div className="shell grid gap-6 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={service.slug} data-reveal style={{ "--i": index } as React.CSSProperties}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 sm:p-8" data-tilt>
                <p className="font-mono text-[0.8125rem] text-teal-deep" aria-hidden="true">
                  {service.folder}
                </p>
                <h2 className="mt-2 text-3xl">{service.title}</h2>
                <p className="mt-3 text-slate">{service.short}</p>
                <ul className="mt-6 mb-8 space-y-2.5">
                  {service.includes.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9375rem]">
                      <Check className="mt-0.5 size-5 flex-none text-teal-deep" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${service.slug}`}
                  className="group mt-auto inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep"
                >
                  More about {service.title.toLowerCase()}
                  <ArrowRight className="arrow size-5" />
                </Link>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="compare-heading">
        <div className="shell">
          <SectionHead
            id="compare-heading"
            tone="tint"
            eyebrow="Which one do you need?"
            title="The difference, side by side"
            lead="Still not sure? That is normal. Tell us what you want to happen and we will point you to the right one."
          />
          <div
            className="mt-10 overflow-x-auto rounded-2xl bg-white"
            role="region"
            aria-label="Table comparing websites, web apps and custom software"
            tabIndex={0}
            data-reveal
          >
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="bg-charcoal text-white">
                  <td className="p-5 sm:p-6">
                    <span className="sr-only">Question</span>
                  </td>
                  {services.map((service) => (
                    <th key={service.slug} scope="col" className="p-5 font-display text-xl font-bold sm:p-6">
                      {service.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.map((row) => (
                  <tr key={row.label} className="border-t border-line first:border-t-0">
                    <th scope="row" className="p-5 align-top font-semibold sm:p-6">
                      {row.label}
                    </th>
                    {row.values.map((value) => (
                      <td key={value} className="p-5 align-top text-slate sm:p-6">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="included-heading">
        <div className="shell">
          <SectionHead id="included-heading" eyebrow="Whatever you choose" title="What comes with every project" />
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item, index) => (
              <li key={item.title} className="flex gap-4" data-reveal style={{ "--i": index % 3 } as React.CSSProperties}>
                <span className="grid size-11 flex-none place-items-center rounded-xl bg-teal-light text-teal-deep">
                  <Check className="size-5" />
                </span>
                <div>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-1 text-slate">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-label="Keep reading">
        <div className="shell">
          <LinkCards
            onTint
            items={[
              { href: "/how-we-work", label: "How a project runs", body: "The same six clear steps, from first chat to support." },
              { href: "/pricing", label: "Packages and pricing", body: "What each package includes, and what can change the price." },
              { href: "/insights/website-or-web-app", label: "Website or web app?", body: "A short guide to working out which one you need." },
            ]}
          />
        </div>
      </section>

      <SimpleCta title="Not sure what you need?" />
    </>
  );
}
