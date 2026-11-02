"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "@/components/ui/icons";
import type { NavItem } from "@/lib/site";
import { NavLink } from "./NavLink";

const linkClass =
  "rounded-md py-2 pl-4 pr-1 text-[0.9375rem] font-medium text-mist transition-colors duration-200 hover:text-white aria-[current=page]:text-teal";

/**
 * A top-level link with a menu of the pages under it. The label stays a real link, so the
 * section is reachable without JavaScript, and the arrow beside it opens the menu by keyboard or touch.
 */
export function NavMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const children = item.children ?? [];

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <NavLink href={item.href} label={item.label} alsoActive={children.map((child) => child.href)} className={linkClass} />
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${open ? "Hide" : "Show"} ${item.label} pages`}
        onClick={() => setOpen((value) => !value)}
        className="grid size-8 cursor-pointer place-items-center rounded-md text-mist transition-colors duration-200 hover:text-white"
      >
        <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div id={panelId} hidden={!open} className="absolute left-1/2 top-full w-[23rem] -translate-x-1/2 pt-3">
        <ul className="nav-panel rounded-2xl border border-white/10 bg-graphite p-2 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)]">
          {children.map((child) => (
            <li key={child.href}>
              <NavLink
                href={child.href}
                label={child.label}
                exact
                onNavigate={() => setOpen(false)}
                className="group block rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-white/[0.06] aria-[current=page]:bg-white/[0.06]"
              >
                <span className="block font-semibold text-white group-aria-[current=page]:text-teal">{child.label}</span>
                <span className="mt-0.5 block text-sm leading-snug text-mist">{child.note}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
