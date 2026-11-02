"use client";

import { useEffect } from "react";
import { whenIdle } from "@/components/three/device";

const TILT_X = 7;
const TILT_Y = 9;
const PULL = 0.28;

/**
 * Card tilt and magnetic buttons, through one listener on the document instead of one per
 * element. It writes CSS variables and nothing re-renders. Touch screens never attach it.
 */
export function PointerEffects() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;

    let card: HTMLElement | null = null;
    let button: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let frame = 0;

    const clear = (element: HTMLElement | null, names: string[]) => {
      for (const name of names) element?.style.removeProperty(name);
    };

    const update = () => {
      frame = 0;
      if (card) {
        const box = card.getBoundingClientRect();
        const px = (x - box.left) / box.width;
        const py = (y - box.top) / box.height;
        card.style.setProperty("--rx", `${((0.5 - py) * TILT_X).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${((px - 0.5) * TILT_Y).toFixed(2)}deg`);
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
      if (button) {
        const box = button.getBoundingClientRect();
        const dx = x - (box.left + box.width / 2);
        const dy = y - (box.top + box.height / 2);
        button.style.setProperty("--pull-x", `${(dx * PULL).toFixed(1)}px`);
        button.style.setProperty("--pull-y", `${(dy * PULL).toFixed(1)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const nextCard = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      const nextButton = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextCard !== card) {
        clear(card, ["--rx", "--ry", "--mx", "--my"]);
        card = nextCard;
      }
      if (nextButton !== button) {
        clear(button, ["--pull-x", "--pull-y"]);
        button = nextButton;
      }
      if (!card && !button) return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const cancelIdle = whenIdle(() => document.addEventListener("pointermove", onMove, { passive: true }));
    return () => {
      cancelIdle();
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
