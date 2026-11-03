import { FlipWords } from "@/components/ui/FlipWords";
import { Clock, Code, Sprout } from "@/components/ui/icons";

const lines: { text: React.ReactNode; indent?: boolean }[] = [
  {
    text: (
      <>
        <span className="text-mist">const</span> <span className="text-white">project</span>{" "}
        <span className="text-mist">= {"{"}</span>
      </>
    ),
  },
  { indent: true, text: <Pair name="code" value="clean" /> },
  { indent: true, text: <Pair name="timeline" value="clear" /> },
  { indent: true, text: <Pair name="quote" value="free" /> },
  { indent: true, text: <Pair name="support" value="after launch" /> },
  { text: <span className="text-mist">{"};"}</span> },
  { text: <>&nbsp;</> },
  {
    text: (
      <>
        <span className="text-white">project</span>
        <span className="text-mist">.</span>
        <span className="text-teal">launch</span>
        <span className="text-mist">();</span>
      </>
    ),
  },
  {
    text: (
      <>
        <span className="text-white">project</span>
        <span className="text-mist">.</span>
        <span className="text-teal">grow</span>
        <span className="text-mist">();</span>
        <span className="caret ml-1 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-teal" />
      </>
    ),
  },
];

function Pair({ name, value }: { name: string; value: string }) {
  return (
    <>
      <span className="text-teal">{name}</span>
      <span className="text-mist">: </span>
      <span className="text-white">&quot;{value}&quot;</span>
      <span className="text-mist">,</span>
    </>
  );
}

const promises = [
  {
    Icon: Code,
    title: "Clean code",
    body: "Written so it is easy to read, easy to change and still works years from now.",
  },
  {
    Icon: Clock,
    title: "Clear timelines",
    body: "You know the scope and the dates before work starts, and we keep you updated.",
  },
  {
    Icon: Sprout,
    title: "Support after launch",
    body: "We do not disappear when the site goes live. We stay and help you grow.",
  },
];

export function PromisePanel() {
  return (
    <section className="below-fold bg-teal-light section-y" aria-labelledby="promise-heading">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-20">
        <div>
          <p className="eyebrow text-charcoal" data-reveal>
            What you can expect
          </p>
          <h2 id="promise-heading" className="display heading-xl mt-5" data-flip>
            <FlipWords text="No jargon. No surprises." />
          </h2>
          <ul className="mt-10 space-y-7">
            {promises.map(({ Icon, title, body }, index) => (
              <li key={title} className="flex gap-5" data-reveal style={{ "--i": index } as React.CSSProperties}>
                <span className="grid size-12 flex-none place-items-center rounded-xl bg-white text-teal-deep">
                  <Icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-1 text-slate">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="code-stage min-w-0" data-reveal>
          <div className="code-swing">
            <figure className="code-window relative rounded-2xl bg-charcoal shadow-[0_32px_64px_-32px_rgb(30_31_34/0.55)]" data-tilt>
              <span className="code-chip right-5 top-0 -translate-y-1/2 bg-teal" aria-hidden="true">
                {"</>"}
              </span>
              <span className="code-chip bottom-0 left-6 translate-y-1/2 bg-white [animation-delay:-2.4s]" aria-hidden="true">
                200 OK
              </span>
              <figcaption className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
                <span className="size-3 rounded-full bg-white/15" />
                <span className="size-3 rounded-full bg-white/15" />
                <span className="size-3 rounded-full bg-teal" />
                <span className="ml-3 font-mono text-[0.8125rem] text-mist">project.ts</span>
              </figcaption>
              <pre className="code-body overflow-x-auto p-6 font-mono text-[0.875rem] leading-[1.9] sm:p-8 sm:text-[0.9375rem]">
                <code>
                  {lines.map((line, index) => (
                    <span
                      key={index}
                      className={`code-line block ${line.indent ? "pl-[2ch]" : ""}`}
                      style={{ "--i": index } as React.CSSProperties}
                    >
                      {line.text}
                    </span>
                  ))}
                </code>
              </pre>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
