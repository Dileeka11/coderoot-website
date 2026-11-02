import type { ReactNode } from "react";
import { GlyphView } from "@/components/three/GlyphView";
import { SlantDivider } from "@/components/ui/SlantDivider";
import { Watermark } from "@/components/ui/Watermark";
import type { ShapeName } from "@/lib/roots/shapes";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Where this page sits in the site, without Home */
  crumbs: readonly Crumb[];
  /** The 3D shape that stands for this page. Several shapes take turns. */
  shapes?: readonly ShapeName[];
  children?: ReactNode;
}

/** The brand's dark cover and watermark, and a shape of code characters when the page has one. */
export function PageHero({ eyebrow, title, crumbs, shapes, children }: PageHeroProps) {
  return (
    <section className="clip-box relative isolate bg-charcoal text-white" data-glyph-host>
      <Watermark className="-right-[8%] top-1/2 -z-10 w-[62rem] max-w-[120%] -translate-y-1/2" />
      {shapes && (
        <GlyphView
          shapes={shapes}
          followScroll
          className="absolute inset-x-0 bottom-[clamp(2.5rem,7vw,5rem)] -z-10 h-64 lg:bottom-[clamp(3rem,6vw,5.5rem)] lg:left-auto lg:right-[3%] lg:top-6 lg:h-auto lg:w-[42%]"
        />
      )}
      {/*
        Beside a 3D shape the heading gets room to spare and the hero a fixed minimum height, so a
        line that wraps differently once the web font loads does not push the whole page down.
      */}
      <div
        className={`shell hero-copy pt-[clamp(2.5rem,6vw,4.5rem)] ${
          shapes ? "pb-[calc(clamp(6.5rem,13vw,11rem)+13rem)] lg:min-h-[36rem] lg:pb-[clamp(6.5rem,13vw,11rem)]" : "pb-[clamp(6.5rem,13vw,11rem)]"
        }`}
      >
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow rise text-mist">{eyebrow}</p>
        <h1
          className={`display heading-xl rise mt-5 ${shapes ? "max-w-4xl lg:max-w-[54%] lg:text-[clamp(2.25rem,3.9vw,3.75rem)]" : "max-w-4xl"}`}
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {title}
        </h1>
        {children && (
          <div
            className={`lead rise mt-6 max-w-2xl text-mist ${shapes ? "lg:max-w-[50%]" : ""}`}
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {children}
          </div>
        )}
      </div>
      <SlantDivider />
    </section>
  );
}
