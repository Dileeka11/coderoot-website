import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Watermark } from "@/components/ui/Watermark";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="clip-box relative isolate flex min-h-[calc(100svh-var(--header-height))] items-center bg-charcoal text-white">
      <Watermark className="-right-[8%] top-1/2 -z-10 w-[62rem] max-w-[120%] -translate-y-1/2" />
      <div className="shell py-20">
        <p className="font-mono text-sm text-teal">404: this path has no root</p>
        <h1 className="display heading-xl mt-5">Page not found</h1>
        <p className="lead mt-5 max-w-lg text-mist">The page you are looking for has moved or does not exist.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" variant="outlineLight">
            Talk to us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
