import type { Tier } from "@/lib/roots/gl";

interface DeviceHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

/** Returns null when the device should keep the static poster instead. */
export function pickTier(): Tier | null {
  const nav = navigator as Navigator & DeviceHints;
  const connection = nav.connection;
  if (connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") {
    return null;
  }

  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  if (memory < 2 || cores < 2) return null;

  if (memory >= 8 && cores >= 8 && window.innerWidth >= 1024) return "high";
  if (memory >= 4 && cores >= 4) return "mid";
  return "low";
}

export const whenIdle = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 400);
  return () => clearTimeout(id);
};

/**
 * A fresh canvas for each run of a scene. A page can be hidden and shown again without being
 * unmounted, and a canvas whose context was released can never get a working one back.
 */
export function addCanvas(holder: HTMLElement, className: string) {
  const canvas = document.createElement("canvas");
  canvas.className = className;
  holder.append(canvas);
  return canvas;
}
