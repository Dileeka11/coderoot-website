import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./icons";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg px-6 py-3 text-[0.9375rem] font-semibold transition-colors duration-200 cursor-pointer";

const variants = {
  /** Teal fill with charcoal text. White on teal would fail contrast. */
  primary: "bg-teal text-charcoal hover:bg-white",
  /** For light sections */
  dark: "bg-charcoal text-white hover:bg-teal-deep",
  outlineLight: "border border-white/30 text-white hover:border-teal hover:text-teal",
  outlineDark: "border border-charcoal/25 text-charcoal hover:border-teal-deep hover:text-teal-deep",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClass(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  className?: string;
  arrow?: boolean;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", className = "", arrow = false, children, ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={buttonClass(variant, className)}>
      {children}
      {arrow && <ArrowRight className="arrow size-[18px]" />}
    </Link>
  );
}

interface ExternalButtonProps extends Omit<ComponentProps<"a">, "className"> {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function ExternalButton({ variant = "primary", className = "", children, ...props }: ExternalButtonProps) {
  return (
    <a {...props} className={buttonClass(variant, className)} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
