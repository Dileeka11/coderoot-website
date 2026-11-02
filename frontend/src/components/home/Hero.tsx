import { RootsPoster } from "@/components/three/RootsPoster";
import { RootsScene } from "@/components/three/RootsScene";
import { ButtonLink } from "@/components/ui/Button";
import { Check } from "@/components/ui/icons";
import { SlantDivider } from "@/components/ui/SlantDivider";

const SEED = 41;
const SHIFT = { wide: [0.42, -0.02], narrow: [0, -0.38] } as const;
const promises = ["Clean code", "Clear timelines", "Support after launch"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0 -z-10">
        <RootsPoster
          seed={SEED}
          brackets
          className="absolute left-1/2 top-1/2 aspect-[2/1] w-[198%] max-w-none -translate-x-1/2 translate-y-[-31%] lg:h-full lg:w-auto lg:translate-x-[-32%] lg:translate-y-[-49%]"
        />
        <RootsScene seed={SEED} brackets followScroll shift={SHIFT} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal from-35% via-charcoal/40 via-55% to-transparent lg:bg-gradient-to-r lg:from-charcoal lg:from-25% lg:via-charcoal/55 lg:via-50%" />
      </div>

      <div className="shell flex min-h-[calc(100svh-var(--header-height))] flex-col pb-[46svh] pt-[clamp(2.75rem,8svh,5rem)] lg:justify-center lg:py-28">
        <div className="hero-copy max-w-[50rem]">
          <h1 className="eyebrow rise text-mist">
            Web and software development company in Sri Lanka
          </h1>

          <p
            className="display rise mt-6 text-[clamp(2rem,10.3vw,4.5rem)] lg:text-[clamp(3.5rem,5.4vw,5.5rem)]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <span className="block whitespace-nowrap">Rooted in code.</span>
            <span className="block whitespace-nowrap text-teal">Built to grow.</span>
          </p>

          <p className="lead rise mt-6 max-w-xl text-mist" style={{ "--i": 2 } as React.CSSProperties}>
            We build websites, web apps and custom software for growing businesses: clean code, clear
            timelines and support after launch.
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={{ "--i": 3 } as React.CSSProperties}>
            <ButtonLink href="/quote" arrow data-magnetic>
              Get a free quote
            </ButtonLink>
            <ButtonLink href="/services" variant="outlineLight">
              What we build
            </ButtonLink>
          </div>

          <ul
            className="rise mt-9 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-mist sm:flex"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            {promises.map((promise) => (
              <li key={promise} className="flex items-center gap-2">
                <Check className="size-4 text-teal" />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SlantDivider />
    </section>
  );
}
