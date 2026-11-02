import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { NavMenu } from "./NavMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-charcoal text-white" style={{ viewTransitionName: "site-header" }}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className="shell flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link href="/" aria-label="CodeRoot Solutions home" className="flex-none">
          <Image
            src="/images/logo-white.svg"
            alt="CodeRoot Solutions"
            width={159}
            height={45}
            priority
            unoptimized
            className="h-[46px] w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) =>
            item.children ? (
              <NavMenu key={item.href} item={item} />
            ) : (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                className="rounded-md px-4 py-2 text-[0.9375rem] font-medium text-mist transition-colors duration-200 hover:text-white aria-[current=page]:text-teal"
              />
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href="/quote" className="whitespace-nowrap">
              Get a free quote
            </ButtonLink>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
