import Image from "next/image";
import { RootsPoster } from "@/components/three/RootsPoster";
import { site } from "@/lib/site";

/** How long after the visitor asked for the page it may leave, on a fast connection */
const SHORTEST_MS = 800;
/** Enough to read it, counted from its first paint, however late that was */
const BRIEFEST_MS = 550;
/** The ceiling after its first paint, whatever the network is doing */
const LONGEST_MS = 1400;
const LEAVE_MS = 1000;

/**
 * Runs before the first paint and decides whether the preloader shows at all. It only appears
 * on the first page of a visit, and never for reduced motion or Data Saver. Without JavaScript
 * this never runs, so the preloader stays hidden and the page simply shows.
 *
 * The page underneath is already there, so nothing is waiting on this. Someone on a slow
 * connection has waited long enough by the time it paints, so they get the briefest version.
 */
const decide = `(function () {
  var root = document.documentElement;
  try {
    if (sessionStorage.getItem("cr-seen") || matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator.connection && navigator.connection.saveData)) return;
    sessionStorage.setItem("cr-seen", "1");
  } catch (e) {
    return;
  }
  root.dataset.preload = "hold";
  var painted = 0;
  var loaded = false;
  var left = false;
  function leave() {
    if (left) return;
    left = true;
    root.dataset.preload = "out";
    setTimeout(function () {
      delete root.dataset.preload;
    }, ${LEAVE_MS});
  }
  function settle() {
    if (!painted || !loaded) return;
    var now = performance.now();
    setTimeout(leave, Math.max(0, ${SHORTEST_MS} - now, ${BRIEFEST_MS} - (now - painted)));
  }
  requestAnimationFrame(function () {
    painted = performance.now();
    settle();
    setTimeout(leave, ${LONGEST_MS});
  });
  addEventListener("load", function () {
    loaded = true;
    settle();
  }, { once: true });
})();`;

export function Preloader() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <div className="preloader" aria-hidden="true">
        <div className="preloader-half preloader-top">
          <span className="preloader-seam" />
        </div>
        <div className="preloader-half preloader-bottom">
          <span className="preloader-seam" />
        </div>
        <div className="preloader-stage">
          <Image
            src="/images/logo-white.svg"
            alt=""
            width={255}
            height={72}
            unoptimized
            loading="eager"
            className="preloader-logo"
          />
          <div className="preloader-roots">
            <RootsPoster seed={41} points={480} className="absolute inset-0 size-full" />
            <span className="preloader-cover" />
          </div>
          <div className="preloader-tag">
            <p>{site.tagline}</p>
            <span className="preloader-line" />
          </div>
        </div>
      </div>
    </>
  );
}
