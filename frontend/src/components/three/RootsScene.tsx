"use client";

import { useEffect, useRef } from "react";
import type { RootsEngine } from "@/lib/roots/engine";
import { addCanvas, pickTier, whenIdle } from "./device";

interface RootsSceneProps {
  seed: number;
  direction?: -1 | 1;
  brackets?: boolean;
  /** Ties the scene to how far the page has scrolled past it */
  followScroll?: boolean;
  shift: { wide: readonly [number, number]; narrow: readonly [number, number] };
}

/**
 * Loads the WebGL scene only once the page is idle and the holder is close to the screen,
 * so it never competes with first paint. Until then, or if it can't run, the poster shows.
 */
export function RootsScene({ seed, direction = -1, brackets = false, followScroll = false, shift }: RootsSceneProps) {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const tier = pickTier();
    if (!tier) return;

    let canvas: HTMLCanvasElement | null = null;
    let engine: RootsEngine | null = null;
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    const onScroll = () => {
      engine?.setScroll(Math.min(window.scrollY / Math.max(holder.clientHeight, 1), 1));
    };

    const load = async () => {
      // The import fails if a deploy replaced the file while this page was open. The poster just stays.
      const { createRootsEngine } = await import("@/lib/roots/engine").catch(() => ({ createRootsEngine: null }));
      if (cancelled || !createRootsEngine) return;
      const target = addCanvas(holder, "absolute inset-0 block size-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100");
      canvas = target;
      try {
        engine = await createRootsEngine({
          canvas: target,
          tier,
          seed,
          direction,
          brackets,
          shift,
          still: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onReady: () => {
            target.dataset.ready = "true";
          },
          onFail: () => {
            delete target.dataset.ready;
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
      if (followScroll) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      }
    };

    const nearScreen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearScreen.disconnect();
        cancelIdle = whenIdle(() => void load());
      },
      { rootMargin: "300px" },
    );
    nearScreen.observe(holder);

    return () => {
      cancelled = true;
      nearScreen.disconnect();
      cancelIdle?.();
      window.removeEventListener("scroll", onScroll);
      engine?.destroy();
      canvas?.remove();
    };
  }, [seed, direction, brackets, followScroll, shift]);

  return <div ref={holderRef} aria-hidden="true" className="absolute inset-0" />;
}
