"use client";

import { useEffect, useRef } from "react";
import type { GlyphEngine } from "@/lib/roots/glyphs";
import type { ShapeName } from "@/lib/roots/shapes";
import { addCanvas, pickTier, whenIdle } from "./device";

const SEED = 29;
const CYCLE_MS = 4200;

interface GlyphSceneProps {
  shapes: readonly ShapeName[];
  /** Ties the scene to how far the page has scrolled past it */
  followScroll?: boolean;
}

/**
 * Loads like RootsScene: only when idle and near the screen, with a poster until then.
 *
 * With several shapes it walks through them while on screen. Anything inside the nearest
 * [data-glyph-host] that has a data-glyph-index follows along through a data-active attribute,
 * and a row that is hovered or focused picks its own shape. It all goes through the DOM, so a
 * shape change never re-renders React.
 */
export function GlyphScene({ shapes, followScroll = false }: GlyphSceneProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const shapeList = shapes.join();

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const names = shapeList.split(",") as ShapeName[];
    const host = holder.closest<HTMLElement>("[data-glyph-host]") ?? holder;
    const followers = [...host.querySelectorAll<HTMLElement>("[data-glyph-index]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let canvas: HTMLCanvasElement | null = null;
    let engine: GlyphEngine | null = null;
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    let active = 0;
    let held = false;
    let onScreen = false;

    const select = (index: number) => {
      if (index === active) return;
      active = index;
      engine?.show(index);
      for (const follower of followers) {
        follower.toggleAttribute("data-active", Number(follower.dataset.glyphIndex) === index);
      }
    };

    const rowFrom = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>("a[data-glyph-index]") : null;

    const onOver = (e: Event) => {
      const row = rowFrom(e.target);
      held = Boolean(row);
      if (row) select(Number(row.dataset.glyphIndex));
    };
    const onOut = () => {
      held = false;
    };

    const hasRows = names.length > 1;
    if (hasRows) {
      host.addEventListener("pointerover", onOver);
      host.addEventListener("focusin", onOver);
      host.addEventListener("pointerleave", onOut);
      host.addEventListener("focusout", onOut);
    }

    const onScroll = () => {
      engine?.setScroll(Math.min(window.scrollY / Math.max(host.clientHeight, 1), 1));
    };

    const tier = pickTier();

    const load = async () => {
      if (!tier) return;
      // The import fails if a deploy replaced the file while this page was open. The poster just stays.
      const { createGlyphEngine } = await import("@/lib/roots/glyphs").catch(() => ({ createGlyphEngine: null }));
      if (cancelled || !createGlyphEngine) return;
      const target = addCanvas(holder, "absolute inset-0 block size-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100");
      canvas = target;
      try {
        engine = await createGlyphEngine({
          canvas: target,
          tier,
          shapes: names,
          seed: SEED,
          still: reduced,
          onReady: () => {
            target.dataset.ready = "true";
            host.toggleAttribute("data-live", true);
          },
          onFail: () => {
            delete target.dataset.ready;
            host.toggleAttribute("data-live", false);
          },
        });
      } catch {
        target.remove();
        return;
      }
      if (cancelled) {
        engine?.destroy();
        return;
      }
      if (!engine) {
        target.remove();
        return;
      }
      engine.show(active);
      if (followScroll) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      }
      if (hasRows && !reduced) {
        timer = setInterval(() => {
          if (!held && onScreen && !document.hidden) select((active + 1) % names.length);
        }, CYCLE_MS);
      }
    };

    let loading = false;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (!onScreen || loading) return;
        loading = true;
        cancelIdle = whenIdle(() => void load());
      },
      { rootMargin: "300px" },
    );
    watcher.observe(holder);

    return () => {
      cancelled = true;
      watcher.disconnect();
      cancelIdle?.();
      clearInterval(timer);
      host.removeEventListener("pointerover", onOver);
      host.removeEventListener("focusin", onOver);
      host.removeEventListener("pointerleave", onOut);
      host.removeEventListener("focusout", onOut);
      window.removeEventListener("scroll", onScroll);
      engine?.destroy();
      canvas?.remove();
      host.toggleAttribute("data-live", false);
    };
  }, [shapeList, followScroll]);

  return <div ref={holderRef} aria-hidden="true" className="absolute inset-0" />;
}
