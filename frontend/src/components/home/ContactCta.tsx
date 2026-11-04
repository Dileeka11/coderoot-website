import { RootsPoster } from "@/components/three/RootsPoster";
import { RootsScene } from "@/components/three/RootsScene";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { FlipWords } from "@/components/ui/FlipWords";
import { WhatsApp } from "@/components/ui/icons";
import { site } from "@/lib/site";

const SEED = 113;
const SHIFT = { wide: [0.42, -0.24], narrow: [0, -0.46] } as const;

/** The hero's roots, turned upward: rooted in code at the top of the page, built to grow at the end of it. */
export function ContactCta() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white" aria-labelledby="cta-heading">
      <div className="absolute inset-0 -z-10">
        <RootsPoster
          seed={SEED}
          direction={1}
          className="absolute left-1/2 top-1/2 aspect-[2/1] w-[198%] max-w-none -translate-x-1/2 translate-y-[-26%] lg:h-full lg:w-auto lg:translate-x-[-29%] lg:translate-y-[-48%]"
        />
        <RootsScene seed={SEED} direction={1} shift={SHIFT} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal from-45% via-charcoal/40 via-70% to-transparent lg:bg-gradient-to-r lg:from-charcoal lg:from-30% lg:via-charcoal/40 lg:via-60%" />
      </div>

      <div className="shell flex min-h-[34rem] flex-col justify-start py-[clamp(4.5rem,9vw,7.5rem)] pb-[22rem] lg:min-h-[38rem] lg:justify-center lg:pb-[clamp(4.5rem,9vw,7.5rem)]">
        <div className="max-w-2xl">
          <p className="eyebrow text-mist" data-reveal>
            Let&apos;s talk
          </p>
          <h2 id="cta-heading" className="display heading-xl mt-5" data-flip>
            <FlipWords text="Have a project in mind?" />
          </h2>
          <p className="lead mt-5 max-w-xl text-mist" data-reveal>
            Tell us what you need and we will send you a free quote. No pressure, and no jargon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-reveal>
            <ButtonLink href="/quote" arrow data-magnetic>
              Ask for a free quote
            </ButtonLink>
            <ExternalButton href={site.whatsapp.href} variant="outlineLight">
              <WhatsApp className="size-5" />
              WhatsApp us
            </ExternalButton>
          </div>
        </div>
      </div>
    </section>
  );
}
