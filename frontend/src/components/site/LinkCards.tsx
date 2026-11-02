import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

interface LinkCardsProps {
  items: ReadonlyArray<{ href: string; label: string; body: string }>;
  /** Tinted sections need white cards to stand out */
  onTint?: boolean;
}

/** Where to go next, at the end of a page. */
export function LinkCards({ items, onTint = false }: LinkCardsProps) {
  return (
    <ul className={`grid gap-5 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
      {items.map((item, index) => (
        <li key={item.href} data-reveal style={{ "--i": index } as React.CSSProperties}>
          <Link
            href={item.href}
            data-tilt
            className={`group flex h-full flex-col rounded-2xl border p-6 sm:p-7 ${onTint ? "border-transparent bg-white" : "border-line bg-white"}`}
          >
            <span className="font-display text-xl font-bold leading-snug">{item.label}</span>
            <span className="mt-2 flex-1 text-slate">{item.body}</span>
            <ArrowRight className="arrow mt-4 size-5 text-teal-deep" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
