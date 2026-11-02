import Link from "next/link";
import { GlyphView } from "@/components/three/GlyphView";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Dashboard, Monitor, Workflow } from "@/components/ui/icons";
import { FlipWords } from "@/components/ui/FlipWords";
import type { ShapeName } from "@/lib/roots/shapes";
import { services } from "@/lib/services";

const icons = {
  "website-development": Monitor,
  "web-application-development": Dashboard,
  "custom-software-development": Workflow,
} as const;

/** One shape per service, in the same order as the services list */
const SHAPES: readonly ShapeName[] = ["browser", "stack", "gear"];

const activeFirst = (index: number) => (index === 0 ? { "data-active": true } : {});

/**
 * The services laid out like an editor: a directory tree of what we build on one side, and a
 * preview of the selected row on the other, built out of code. Code on the surface, roots underneath.
 */
export function ServicesTree() {
  return (
    <section className="below-fold section-y bg-white" aria-labelledby="services-heading">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-teal-deep" data-reveal>
              What we build
            </p>
            <h2 id="services-heading" className="display heading-xl mt-5" data-flip>
              <FlipWords text="Three ways we help your business grow" />
            </h2>
          </div>
          <p className="lead max-w-xl text-slate lg:justify-self-end" data-reveal>
            Whether you need your first website or software to run your business, we start with what you
            need and build only what helps.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10" data-glyph-host>
          <div className="min-w-0">
            <p className="pb-3 font-mono text-sm text-teal-deep" aria-hidden="true">
              coderoot/
            </p>
            <ul>
              {services.map((service, index) => {
                const Icon = icons[service.slug as keyof typeof icons];
                return (
                  <li key={service.slug} className="tree-branch pb-3 last:pb-0" style={{ "--i": index } as React.CSSProperties}>
                    <Link
                      href={`/services/${service.slug}`}
                      data-tilt
                      data-glyph-index={index}
                      {...activeFirst(index)}
                      className="group grid items-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-white p-6 transition-colors duration-300 hover:border-teal hover:bg-teal-light data-active:border-teal data-active:bg-teal-light sm:p-8 md:grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr] xl:grid-cols-[auto_1fr_auto]"
                    >
                      <span className="grid size-14 place-items-center rounded-xl bg-teal-light text-teal-deep transition-colors duration-300 group-hover:bg-white group-data-active:bg-white">
                        <Icon className="size-7" />
                      </span>
                      <span>
                        <span className="block font-mono text-[0.8125rem] text-teal-deep transition-colors duration-300 group-hover:text-charcoal group-data-active:text-charcoal" aria-hidden="true">
                          {service.folder}
                        </span>
                        <span className="mt-1 block font-display text-[clamp(1.5rem,3vw,2.125rem)] font-bold leading-tight">
                          {service.title}
                        </span>
                        <span className="mt-2 block max-w-2xl text-slate">{service.short}</span>
                      </span>
                      <span className="flex items-center gap-2 font-semibold text-teal-deep transition-colors duration-300 group-hover:text-charcoal group-data-active:text-charcoal lg:col-start-2 xl:col-start-auto">
                        Learn more
                        <ArrowRight className="arrow size-5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ButtonLink href="/services" variant="outlineDark" arrow className="mt-8">
              Compare our services
            </ButtonLink>
          </div>

          <div
            className="order-first flex flex-col overflow-hidden rounded-2xl bg-charcoal text-white shadow-[0_32px_64px_-32px_rgb(30_31_34/0.55)] lg:order-none"
            aria-hidden="true"
            data-reveal
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              <span className="size-3 rounded-full bg-white/15" />
              <span className="size-3 rounded-full bg-white/15" />
              <span className="size-3 rounded-full bg-teal" />
              <span className="ml-3 font-mono text-[0.8125rem] text-mist">
                preview ~{" "}
                {services.map((service, index) => (
                  <span key={service.slug} className="glyph-label text-teal" data-glyph-index={index} {...activeFirst(index)}>
                    {service.folder}
                  </span>
                ))}
              </span>
            </div>
            <GlyphView
              shapes={SHAPES}
              className="relative aspect-[16/11] w-full bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[length:22px_22px] lg:aspect-auto lg:min-h-[24rem] lg:flex-1"
            />
            <div className="flex gap-1.5 px-5 pb-5 pt-1">
              {services.map((service, index) => (
                <span
                  key={service.slug}
                  className="h-[3px] flex-1 bg-white/15 transition-colors duration-500 data-active:bg-teal"
                  data-glyph-index={index}
                  {...activeFirst(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
