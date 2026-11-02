"use client";

import { useEffect } from "react";
import { whenIdle } from "@/components/three/device";

/**
 * One shared observer for every [data-reveal] element, instead of one per component. It starts
 * when the browser goes idle, because changing a class before React has hydrated that part of
 * the page counts as a hydration mismatch.
 */
export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );

    const selector = "[data-reveal]:not(.is-in), [data-flip]:not(.is-in), .tree-branch:not(.is-in)";
    const observeIn = (root: ParentNode) => root.querySelectorAll(selector).forEach((element) => observer.observe(element));

    // Content that arrives later, such as projects from the API, is picked up as it is added.
    const added = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(selector)) observer.observe(node);
          observeIn(node);
        });
      }
    });

    const cancelIdle = whenIdle(() => {
      observeIn(document);
      added.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      cancelIdle();
      added.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
