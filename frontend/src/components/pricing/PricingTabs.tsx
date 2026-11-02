"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

interface Panel {
  id: string;
  label: string;
  content: ReactNode;
}

/** Every panel is in the page for search engines. Without JavaScript the CSS simply shows them all. */
export function PricingTabs({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(panels[0].id);
  const listRef = useRef<HTMLDivElement>(null);

  // A service page links here with its service in the address, such as /pricing#website-development.
  useEffect(() => {
    const fromAddress = () => {
      const id = window.location.hash.slice(1);
      if (!panels.some((panel) => panel.id === id)) return;
      setActive(id);
      listRef.current?.scrollIntoView({ block: "start" });
    };
    fromAddress();
    window.addEventListener("hashchange", fromAddress);
    return () => window.removeEventListener("hashchange", fromAddress);
  }, [panels]);

  const choose = (id: string) => {
    setActive(id);
    window.history.replaceState(window.history.state, "", `#${id}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = panels.length - 1;
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    choose(panels[next].id);
    listRef.current?.querySelectorAll("button")[next]?.focus();
  };

  return (
    <>
      <div
        ref={listRef}
        role="tablist"
        aria-label="Choose a service"
        className="plan-tabs grid scroll-mt-[calc(var(--header-height)+1.5rem)] grid-cols-2 gap-1 sm:grid-cols-4 rounded-xl bg-neutral p-1.5 sm:mx-auto sm:w-fit sm:gap-1.5"
      >
        {panels.map((panel, index) => (
          <button
            key={panel.id}
            type="button"
            role="tab"
            id={`tab-${panel.id}`}
            aria-selected={active === panel.id}
            aria-controls={panel.id}
            tabIndex={active === panel.id ? 0 : -1}
            onClick={() => choose(panel.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className="min-h-11 cursor-pointer rounded-lg px-2 py-2 text-sm font-semibold leading-tight text-charcoal transition-colors duration-200 hover:bg-white aria-selected:bg-charcoal aria-selected:text-white sm:px-6 sm:text-[0.9375rem]"
          >
            {panel.label}
          </button>
        ))}
      </div>

      {panels.map((panel) => (
        <div key={panel.id} id={panel.id} role="tabpanel" aria-labelledby={`tab-${panel.id}`} hidden={active !== panel.id} className="plan-panel mt-10">
          {panel.content}
        </div>
      ))}
    </>
  );
}
