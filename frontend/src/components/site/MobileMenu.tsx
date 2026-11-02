"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { footerLinks, navigation, site } from "@/lib/site";
import { Close, Menu, WhatsApp } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/Button";
import { NavLink } from "./NavLink";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 cursor-pointer place-items-center rounded-lg text-white"
      >
        {open ? <Close /> : <Menu />}
      </button>

      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-50 overflow-y-auto bg-charcoal px-4 pb-8 pt-4"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {navigation.map((item) => (
            <div key={item.href} className="border-b border-white/10 py-3">
              <NavLink
                href={item.href}
                label={item.label}
                exact={Boolean(item.children)}
                onNavigate={close}
                className="block py-1 font-display text-2xl font-semibold text-white aria-[current=page]:text-teal"
              />
              {item.children && (
                <ul className="mt-1 pb-1">
                  {item.children
                    .filter((child) => child.href !== item.href)
                    .map((child) => (
                      <li key={child.href}>
                        <NavLink
                          href={child.href}
                          label={child.label}
                          exact
                          onNavigate={close}
                          className="block py-2 text-mist aria-[current=page]:text-teal"
                        />
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
          <Link href="/faq" onClick={close} className="block border-b border-white/10 py-4 font-display text-2xl font-semibold text-white">
            FAQ
          </Link>
        </nav>
        <Link href="/quote" onClick={close} className={buttonClass("primary", "mt-7 w-full")}>
          Get a free quote
        </Link>
        <a
          href={site.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("outlineLight", "mt-3 w-full")}
        >
          <WhatsApp className="size-5" />
          Chat on WhatsApp
        </a>
        <p className="mt-6 text-sm text-mist">
          <a href={site.phone.href} className="block py-1.5 text-white">
            {site.phone.international}
          </a>
          <a href={`mailto:${site.email}`} className="block py-1.5 text-white">
            {site.email}
          </a>
        </p>
        <p className="mt-4 flex gap-5 text-sm">
          {footerLinks.legal.map((link) => (
            <Link key={link.href} href={link.href} onClick={close} className="py-1.5 text-mist">
              {link.label}
            </Link>
          ))}
        </p>
      </div>
    </div>
  );
}
