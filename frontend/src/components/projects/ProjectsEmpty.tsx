import { ButtonLink } from "@/components/ui/Button";

/** Shown until real projects are published. The brand rule is clear: no made up clients. */
export function ProjectsEmpty({ heading: Heading = "h3" }: { heading?: "h2" | "h3" }) {
  return (
    <div className="grid items-center gap-8 rounded-2xl bg-neutral p-7 sm:p-10 lg:grid-cols-[1fr_auto]" data-reveal>
      <div>
        <p className="font-mono text-sm text-slate" aria-hidden="true">
          $ git log projects/
        </p>
        <Heading className="mt-3 text-2xl sm:text-3xl">Our first case studies are on the way</Heading>
        <p className="mt-3 max-w-2xl text-slate">
          We are new, and we would rather show you real work than fill this page with examples. Want your
          project to be one of the first? We would love to hear about it.
        </p>
      </div>
      <ButtonLink href="/quote" variant="dark" arrow>
        Tell us about your project
      </ButtonLink>
    </div>
  );
}
