"use client";

import { buttonClass } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[70svh] items-center bg-charcoal text-white">
      <div className="shell py-20">
        <h1 className="display heading-xl">Something went wrong</h1>
        <p className="lead mt-5 max-w-lg text-mist">
          We could not load this page just now. Please try again in a moment.
        </p>
        <button type="button" onClick={reset} className={buttonClass("primary", "mt-8")}>
          Try again
        </button>
      </div>
    </section>
  );
}
