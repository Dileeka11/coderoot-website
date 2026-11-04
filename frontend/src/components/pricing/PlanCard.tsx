import { ButtonLink } from "@/components/ui/Button";
import { Check } from "@/components/ui/icons";
import { formatPrice, type Plan } from "@/lib/pricing";

/** `tab` is the pricing group, such as "SEO", because the package names repeat in every group. */
export function PlanCard({ plan, need, tab, index }: { plan: Plan; need: string; tab: string; index: number }) {
  const { featured } = plan;

  return (
    <li className="min-w-0" data-reveal style={{ "--i": index } as React.CSSProperties}>
      <article
        className={`relative flex h-full flex-col rounded-2xl p-7 sm:p-8 ${
          featured ? "bg-charcoal text-white shadow-[0_32px_64px_-32px_rgb(30_31_34/0.6)]" : "border border-line bg-white"
        }`}
        data-tilt
      >
        {featured && (
          <span className="absolute -top-3 left-7 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-charcoal sm:left-8">Best for most businesses</span>
        )}
        <h3 className="text-2xl">{plan.name}</h3>
        <p className={`mt-2 min-h-12 xl:min-h-[4.875rem] ${featured ? "text-mist" : "text-slate"}`}>{plan.bestFor}</p>

        <p className="mt-6 flex items-baseline gap-2 font-display font-bold">
          <span className={`text-lg ${featured ? "text-mist" : "text-slate"}`}>Rs.</span>
          <span className="text-[2.75rem] leading-none tracking-tight">{formatPrice(plan.price)}</span>
          {plan.per && <span className={`text-lg ${featured ? "text-mist" : "text-slate"}`}>/{plan.per}</span>}
        </p>

        <ul className={`mt-7 space-y-3 border-t pt-7 ${featured ? "border-white/15" : "border-line"}`}>
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 text-[0.9375rem] leading-snug">
              <Check className={`mt-0.5 size-[18px] flex-none ${featured ? "text-teal" : "text-teal-deep"}`} />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <ButtonLink
            href={`/quote?need=${need}&plan=${encodeURIComponent(plan.name)}`}
            variant={featured ? "primary" : "outlineDark"}
            className="w-full"
            arrow
          >
            {/* The hidden words make each link's text different, for screen readers and search engines */}
            Get started<span className="sr-only">{` with ${plan.name} ${tab.toLowerCase()}`}</span>
          </ButtonLink>
        </div>
      </article>
    </li>
  );
}
