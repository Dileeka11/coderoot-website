import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { Eye, Gauge, Pen, Search, Shield, Smartphone } from "@/components/ui/icons";
import { ToolChips } from "@/components/ui/ToolChips";
import { pageMetadata } from "@/lib/seo";
import { techGroups, techPrinciples, techStandards } from "@/lib/technology";

export const metadata = pageMetadata({
  title: "Technology: The Tools We Build With",
  description:
    "The tools CodeRoot Solutions builds with, including Next.js, React, Laravel, Java, Python, Three.js, PostgreSQL and MongoDB, why we chose them, and the standards built into every project.",
  path: "/technology",
});

const standardIcons = {
  speed: Gauge,
  security: Shield,
  search: Search,
  phones: Smartphone,
  access: Eye,
  updates: Pen,
} as const;

/** A real summary of how this website is built. */
const stack: { key: string; value: string }[] = [
  { key: "frontend", value: '["next", "react", "typescript", "tailwindcss"]' },
  { key: "backend", value: '["laravel", "php"]' },
  { key: "admin", value: '"filament"' },
  { key: "database", value: '"mysql"' },
  { key: "3d", value: '"handwritten webgl"' },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero eyebrow="Technology" title="Modern tools, chosen to last" crumbs={[{ name: "Technology", path: "/technology" }]} shapes={["brackets"]}>
        You do not need to know any of this to work with us. But if you are curious, or your technical team asks, here is what we build with and why.
      </PageHero>

      <section className="section-y" aria-labelledby="tools-heading">
        <div className="shell">
          <SectionHead id="tools-heading" eyebrow="What we build with" title="The right tool at each layer" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {techGroups.map((group, index) => (
              <li
                key={group.title}
                className={index < 2 ? "lg:col-span-3" : "lg:col-span-2"}
                data-reveal
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7" data-tilt>
                  <h3 className="text-2xl">{group.title}</h3>
                  <p className="mb-5 mt-2 flex-1 text-slate">{group.body}</p>
                  <ToolChips tools={group.tools} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-labelledby="choose-heading">
        <div className="shell">
          <SectionHead id="choose-heading" tone="tint" eyebrow="How we choose" title="Three rules for picking a tool" />
          <ol className="mt-10 grid gap-5 lg:grid-cols-3">
            {techPrinciples.map((principle, index) => (
              <li key={principle.title} className="rounded-2xl bg-white p-7" data-reveal style={{ "--i": index } as React.CSSProperties}>
                <span aria-hidden="true" className="font-display text-lg font-bold text-teal-deep">
                  0{index + 1}
                </span>
                <h3 className="mt-2 text-2xl">{principle.title}</h3>
                <p className="mt-2 text-slate">{principle.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="below-fold bg-charcoal text-white section-y" aria-labelledby="standards-heading">
        <div className="shell">
          <SectionHead
            id="standards-heading"
            tone="dark"
            eyebrow="In every project"
            title="Built in, not added later"
            lead="These are not extras. They are part of how we build, whatever the size of the project."
          />
          <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {techStandards.map((standard, index) => {
              const Icon = standardIcons[standard.key];
              return (
                <li key={standard.key} className="flex gap-4" data-reveal style={{ "--i": index } as React.CSSProperties}>
                  <span className="grid size-12 flex-none place-items-center rounded-xl bg-graphite text-teal">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-xl">{standard.title}</h3>
                    <p className="mt-1 text-mist">{standard.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="proof-heading">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-20">
          <SectionHead
            id="proof-heading"
            eyebrow="See it for yourself"
            title="This website is the example"
            lead="This site is built with Next.js, Laravel and handwritten WebGL from this page, including the 3D you have been looking at. Open it on your phone, on mobile data, and judge it for yourself. That is the standard we hold our own work to."
          />
          <div className="code-stage min-w-0" data-reveal>
            <div className="code-swing">
              <figure className="code-window relative rounded-2xl bg-charcoal shadow-[0_32px_64px_-32px_rgb(30_31_34/0.55)]" data-tilt>
                <figcaption className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
                  <span className="size-3 rounded-full bg-white/15" />
                  <span className="size-3 rounded-full bg-white/15" />
                  <span className="size-3 rounded-full bg-teal" />
                  <span className="ml-3 font-mono text-[0.8125rem] text-mist">coderootsolutions.com</span>
                </figcaption>
                <pre className="code-body whitespace-pre-wrap p-6 font-mono text-[0.8125rem] leading-[1.9] text-white sm:p-8 sm:text-[0.9375rem]">
                  <code>
                    <span className="code-line block text-mist">{"{"}</span>
                    {stack.map((line, index) => (
                      <span key={line.key} className="code-line block pl-[2ch]" style={{ "--i": index + 1 } as React.CSSProperties}>
                        <span className="text-teal">{line.key}</span>
                        <span className="text-mist">: </span>
                        {line.value}
                        <span className="text-mist">,</span>
                      </span>
                    ))}
                    <span className="code-line block text-mist" style={{ "--i": stack.length + 1 } as React.CSSProperties}>
                      {"}"}
                    </span>
                  </code>
                </pre>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-label="Keep reading">
        <div className="shell">
          <LinkCards
            onTint
            items={[
              { href: "/services", label: "What we build with them", body: "Websites, web apps and custom software." },
              { href: "/how-we-work", label: "How a project runs", body: "The same six clear steps, every time." },
              { href: "/insights/why-your-website-is-slow", label: "Why websites get slow", body: "The usual causes, and what actually helps." },
            ]}
          />
        </div>
      </section>

      <SimpleCta title="Have a technical question?" />
    </>
  );
}
