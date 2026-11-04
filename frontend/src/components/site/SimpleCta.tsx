import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { WhatsApp } from "@/components/ui/icons";
import { Watermark } from "@/components/ui/Watermark";
import { site } from "@/lib/site";

interface SimpleCtaProps {
  title?: string;
  /** Where the main button goes, for example a quote form with a service already chosen */
  href?: string;
}

export function SimpleCta({ title = "Have a project in mind?", href = "/quote" }: SimpleCtaProps) {
  return (
    <section className="below-fold clip-box relative isolate bg-charcoal text-white">
      <Watermark className="-right-[6%] top-1/2 -z-10 w-[44rem] -translate-y-1/2" />
      <div className="shell section-y">
        <h2 className="display heading-xl max-w-3xl">{title}</h2>
        <p className="lead mt-5 max-w-xl text-mist">Tell us what you need and we will send you a free quote.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={href} arrow>
            Ask for a free quote
          </ButtonLink>
          <ExternalButton href={site.whatsapp.href} variant="outlineLight">
            <WhatsApp className="size-5" />
            WhatsApp us
          </ExternalButton>
        </div>
      </div>
    </section>
  );
}
