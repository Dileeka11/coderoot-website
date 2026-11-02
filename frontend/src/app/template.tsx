import { ViewTransition, type ReactNode } from "react";
import { PointerEffects } from "@/components/site/PointerEffects";
import { RevealObserver } from "@/components/site/RevealObserver";

/** Templates remount on every navigation, which lets pages animate and the effects find the new page. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>
        {children}
        <RevealObserver />
        <PointerEffects />
      </div>
    </ViewTransition>
  );
}
