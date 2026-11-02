import type { ReactNode } from "react";
import { FlipWords } from "@/components/ui/FlipWords";

/** white and tint match the section's background: deep teal text only has enough contrast on white. */
const eyebrowColor = { white: "text-teal-deep", tint: "text-charcoal", dark: "text-mist" } as const;

interface SectionHeadProps {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  tone?: keyof typeof eyebrowColor;
  size?: "xl" | "lg";
  className?: string;
}

export function SectionHead({ id, eyebrow, title, lead, tone = "white", size = "xl", className = "" }: SectionHeadProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className={`eyebrow ${eyebrowColor[tone]}`} data-reveal>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={`display ${size === "xl" ? "heading-xl" : "heading-lg"} ${eyebrow ? "mt-5" : ""}`} data-flip>
        <FlipWords text={title} />
      </h2>
      {lead && (
        <p className={`lead mt-5 max-w-2xl ${tone === "dark" ? "text-mist" : "text-slate"}`} data-reveal>
          {lead}
        </p>
      )}
    </div>
  );
}
