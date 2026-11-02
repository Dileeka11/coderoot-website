"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  /** Other pages that should also mark this link as current */
  alsoActive?: readonly string[];
  /** Only this exact page marks the link as current, not the pages under it */
  exact?: boolean;
  className?: string;
  onNavigate?: () => void;
  children?: ReactNode;
}

function ActiveLink({ href, label, alsoActive = [], exact = false, className, onNavigate, children }: NavLinkProps) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (!exact && pathname.startsWith(`${href}/`)) ||
    alsoActive.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <Link href={href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={className}>
      {children ?? label}
    </Link>
  );
}

/** usePathname can suspend on routes with unknown params, so the plain link stands in until it resolves. */
export function NavLink(props: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} className={props.className}>
          {props.children ?? props.label}
        </Link>
      }
    >
      <ActiveLink {...props} />
    </Suspense>
  );
}
