import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { createRandom } from "@/lib/roots/generate";
import { techBandRows } from "@/lib/technology";

/** Copies of each row. The track moves by exactly one copy, so the loop has no visible seam on any screen. */
const COPIES = 4;
const RAIN_COLUMNS = 24;
const RAIN_LENGTH = 30;
const RAIN_CHARACTERS = "{}<>/;:=()[]01";

const logoId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

function codeRain() {
  const rnd = createRandom(29);
  return Array.from({ length: RAIN_COLUMNS }, () => {
    const text = Array.from({ length: RAIN_LENGTH }, () => RAIN_CHARACTERS[Math.floor(rnd() * RAIN_CHARACTERS.length)]).join("");
    return { text: text + text, time: 22 + Math.round(rnd() * 26), delay: -Math.round(rnd() * 40) };
  });
}

/**
 * Everything moving here is CSS, so this section adds no JavaScript and stops when it is off screen.
 * The logos are one cached file rather than part of the page, which keeps the page itself small.
 */
export function TechLogos() {
  return (
    <section className="below-fold relative isolate overflow-hidden bg-charcoal py-[clamp(3.5rem,7vw,5.5rem)] text-white" aria-labelledby="tech-heading">
      <div className="code-rain -z-10" aria-hidden="true">
        {codeRain().map((column, index) => (
          <span key={index} style={{ "--t": `${column.time}s`, "--d": `${column.delay}s` } as React.CSSProperties}>
            {column.text}
          </span>
        ))}
      </div>

      <h2 id="tech-heading" className="shell text-center font-mono text-xs font-medium uppercase tracking-[0.3em] text-mist sm:text-sm">
        Built with proven technologies
      </h2>

      <div className="mt-10 space-y-4">
        {techBandRows.map((row, rowIndex) => (
          <div key={rowIndex} className="logo-row">
            <div className={`logo-track ${rowIndex % 2 ? "logo-track-back" : ""}`}>
              {Array.from({ length: COPIES }, (_, copy) => (
                <ul key={copy} className="logo-copy" aria-hidden={copy > 0 || undefined}>
                  {row.map((name) => (
                    <li key={name} className="logo-chip">
                      <svg className="size-7 flex-none" aria-hidden="true">
                        <use href={`/images/tech-logos.svg#${logoId(name)}`} />
                      </svg>
                      {name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="shell mt-9 text-center">
        <Link href="/technology" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-white transition-colors duration-200 hover:text-teal">
          Why we chose these tools
          <ArrowRight className="arrow size-5" />
        </Link>
      </p>
    </section>
  );
}
