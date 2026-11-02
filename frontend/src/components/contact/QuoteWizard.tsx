"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { ArrowRight, Mail, WhatsApp } from "@/components/ui/icons";
import { handOff, inputClass } from "./handoff";

const NEEDS = [
  {
    value: "website-development",
    label: "A website",
    note: "To show what you do and bring in enquiries",
    ask: "I'd like a free quote for a website",
  },
  {
    value: "web-application-development",
    label: "A web app",
    note: "So people can log in and get things done online",
    ask: "I'd like a free quote for a web app",
  },
  {
    value: "custom-software-development",
    label: "Custom software",
    note: "To run part of your business your way",
    ask: "I'd like a free quote for custom software",
  },
  {
    value: "seo",
    label: "SEO",
    note: "To rank higher when people search on Google",
    ask: "I'd like a free quote for SEO",
  },
  {
    value: "social-media",
    label: "Social media marketing",
    note: "Posts and boosts for your business pages",
    ask: "I'd like a free quote for social media marketing",
  },
  {
    value: "graphic-design",
    label: "Graphic design",
    note: "Logos, visiting cards and brand designs",
    ask: "I'd like a free quote for graphic design",
  },
  {
    value: "not-sure",
    label: "Not sure yet",
    note: "Tell us your goal and we will suggest what fits",
    ask: "I'm not sure what I need yet, and I'd like your advice",
  },
] as const;

const STAGES = ["Something new", "Improving what I already have"];

const FEATURES: Record<string, string[]> = {
  "website-development": [
    "An online store",
    "Bookings or enquiries",
    "An admin panel to update content",
    "A gallery or portfolio",
    "A blog or news section",
    "More than one language",
  ],
  "web-application-development": [
    "User logins",
    "Online bookings",
    "A customer portal",
    "Dashboards and reports",
    "Online payments",
    "A connection to another system",
  ],
  "custom-software-development": [
    "Stock or inventory",
    "Sales and billing",
    "Staff and attendance",
    "Customer records",
    "Reports",
    "Connecting the tools I already use",
  ],
};

const TIMINGS = ["As soon as possible", "In the next few months", "Later on", "No fixed date yet"];

const STEP_LABELS = ["Project", "Details", "Timing", "You"];

interface Brief {
  need: string;
  /** The package chosen on the pricing page, if any */
  plan: string;
  stage: string;
  features: string[];
  description: string;
  timing: string;
  budget: string;
  name: string;
  business: string;
}

type Errors = Partial<Record<"need" | "description" | "name", string>>;

function compose(brief: Brief) {
  const who = brief.business ? `${brief.name} from ${brief.business}` : brief.name;
  const ask = NEEDS.find((need) => need.value === brief.need)?.ask;
  const lines = [`Hi CodeRoot, I'm ${who}.`, `${ask}${brief.stage ? ` (${brief.stage.toLowerCase()})` : ""}.`];

  if (brief.plan) lines.push(`Package I'm interested in: ${brief.plan}.`);
  if (brief.features.length > 0) lines.push(`It should include: ${brief.features.join(", ")}.`);
  lines.push("", brief.description);
  if (brief.timing) lines.push("", `Timing: ${brief.timing}`);
  if (brief.budget) lines.push(`Budget in mind: ${brief.budget}`);

  return lines.join("\n");
}

const optionClass =
  "flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-4 transition-colors duration-200 hover:border-slate has-[:checked]:border-teal has-[:checked]:bg-teal-light has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal";

function Wizard({ initialNeed = "", initialPlan = "" }: { initialNeed?: string; initialPlan?: string }) {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>({
    need: initialNeed,
    plan: initialPlan,
    stage: "",
    features: [],
    description: "",
    timing: "",
    budget: "",
    name: "",
    business: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sentBy, setSentBy] = useState<"whatsapp" | "email" | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepRef = useRef(step);

  // Moving between steps replaces what is on screen, so keyboard and screen reader users are moved too.
  useEffect(() => {
    if (stepRef.current !== step) headingRef.current?.focus();
    stepRef.current = step;
  }, [step]);

  const update = <K extends keyof Brief>(field: K, value: Brief[K]) => setBrief((current) => ({ ...current, [field]: value }));

  const toggleFeature = (feature: string) =>
    update("features", brief.features.includes(feature) ? brief.features.filter((item) => item !== feature) : [...brief.features, feature]);

  const validate = (): Errors => {
    if (step === 0 && !brief.need) return { need: "Please choose one. \"Not sure yet\" is fine." };
    if (step === 1 && !brief.description.trim()) return { description: "Please tell us a little about what you need." };
    if (step === 3 && !brief.name.trim()) return { name: "Please tell us your name." };
    return {};
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    if (step < STEP_LABELS.length - 1) {
      setStep(step + 1);
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = submitter?.value === "email" ? "email" : "whatsapp";
    handOff(channel, `Quote request from ${brief.name.trim()}`, compose({ ...brief, name: brief.name.trim(), description: brief.description.trim() }));
    setSentBy(channel);
  };

  const features = FEATURES[brief.need] ?? [];
  const chosen = NEEDS.find((need) => need.value === brief.need);

  return (
    <form onSubmit={submit} noValidate className="min-w-0 rounded-2xl border border-line bg-white p-6 sm:p-8">
      <ol className="grid grid-cols-4 gap-2" aria-label="Your progress">
        {STEP_LABELS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined} className="min-w-0">
            <span className={`block h-1 rounded-full transition-colors duration-300 ${index <= step ? "bg-teal" : "bg-line"}`} />
            <span className={`mt-2 block truncate text-sm ${index === step ? "font-semibold text-charcoal" : "text-slate"}`}>{label}</span>
          </li>
        ))}
      </ol>

      <div key={step} className="step-in mt-8">
        {step === 0 && (
          <>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl outline-none">
              What can we help you with?
            </h2>
            <fieldset className="mt-5">
              <legend className="sr-only">What do you need?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {NEEDS.map((need) => (
                  <label key={need.value} className={optionClass}>
                    <input
                      type="radio"
                      name="need"
                      value={need.value}
                      checked={brief.need === need.value}
                      onChange={() => setBrief((current) => ({ ...current, need: need.value, plan: "" }))}
                      aria-describedby={errors.need ? "quote-need-error" : undefined}
                      className="mt-1 size-4 flex-none accent-[var(--color-teal-deep)]"
                    />
                    <span>
                      <span className="block font-semibold">{need.label}</span>
                      <span className="mt-0.5 block text-sm leading-snug text-slate">{need.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.need && (
                <p id="quote-need-error" className="mt-2 text-sm text-danger">
                  {errors.need}
                </p>
              )}
              {brief.plan && (
                <p className="mt-3 text-sm text-slate">
                  Package you chose: <span className="font-semibold text-charcoal">{brief.plan}</span>
                </p>
              )}
            </fieldset>

            <fieldset className="mt-7">
              <legend className="font-medium">Is this something new? (optional)</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {STAGES.map((stage) => (
                  <label key={stage} className={optionClass}>
                    <input
                      type="radio"
                      name="stage"
                      value={stage}
                      checked={brief.stage === stage}
                      onChange={() => update("stage", stage)}
                      className="mt-1 size-4 flex-none accent-[var(--color-teal-deep)]"
                    />
                    <span>{stage}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 1 && (
          <>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl outline-none">
              Tell us a little more
            </h2>
            {features.length > 0 && (
              <fieldset className="mt-5">
                <legend className="font-medium">What should it include? (optional)</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <label key={feature} className={optionClass}>
                      <input
                        type="checkbox"
                        checked={brief.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="mt-1 size-4 flex-none accent-[var(--color-teal-deep)]"
                      />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <div className="mt-6">
              <label htmlFor="quote-description" className="font-medium">
                In your own words, what do you need?
              </label>
              <textarea
                id="quote-description"
                name="description"
                rows={5}
                maxLength={1500}
                required
                value={brief.description}
                onChange={(event) => update("description", event.target.value)}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "quote-description-error" : "quote-description-hint"}
                className={inputClass}
              />
              {errors.description ? (
                <p id="quote-description-error" className="mt-1.5 text-sm text-danger">
                  {errors.description}
                </p>
              ) : (
                <p id="quote-description-hint" className="mt-1.5 text-sm text-slate">
                  What does your business do, and what do you want this to change?
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl outline-none">
              Timing and budget
            </h2>
            <p className="mt-2 text-slate">Both are optional. They only help us suggest what makes sense for you.</p>
            <fieldset className="mt-5">
              <legend className="font-medium">When would you like to start using it?</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {TIMINGS.map((timing) => (
                  <label key={timing} className={optionClass}>
                    <input
                      type="radio"
                      name="timing"
                      value={timing}
                      checked={brief.timing === timing}
                      onChange={() => update("timing", timing)}
                      className="mt-1 size-4 flex-none accent-[var(--color-teal-deep)]"
                    />
                    <span>{timing}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6">
              <label htmlFor="quote-budget" className="font-medium">
                Do you have a budget in mind?
              </label>
              <input
                id="quote-budget"
                name="budget"
                type="text"
                maxLength={80}
                value={brief.budget}
                onChange={(event) => update("budget", event.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl outline-none">
              Who should we reply to?
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="quote-name" className="font-medium">
                  Your name
                </label>
                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  required
                  value={brief.name}
                  onChange={(event) => update("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "quote-name-error" : undefined}
                  className={inputClass}
                />
                {errors.name && (
                  <p id="quote-name-error" className="mt-1.5 text-sm text-danger">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="quote-business" className="font-medium">
                  Business name (optional)
                </label>
                <input
                  id="quote-business"
                  name="business"
                  type="text"
                  autoComplete="organization"
                  maxLength={80}
                  value={brief.business}
                  onChange={(event) => update("business", event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <dl className="mt-6 rounded-xl bg-neutral p-5 text-[0.9375rem]">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">You need:</dt>
                <dd>{chosen?.label}</dd>
              </div>
              {brief.plan && (
                <div className="mt-1.5 flex flex-wrap gap-x-2">
                  <dt className="font-semibold">Package:</dt>
                  <dd>{brief.plan}</dd>
                </div>
              )}
              {brief.features.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-x-2">
                  <dt className="font-semibold">Including:</dt>
                  <dd>{brief.features.join(", ")}</dd>
                </div>
              )}
              {brief.timing && (
                <div className="mt-1.5 flex flex-wrap gap-x-2">
                  <dt className="font-semibold">Timing:</dt>
                  <dd>{brief.timing}</dd>
                </div>
              )}
            </dl>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className={buttonClass("outlineDark")}>
            Back
          </button>
        )}
        {step < STEP_LABELS.length - 1 ? (
          <button type="submit" className={buttonClass("dark")}>
            Continue
            <ArrowRight className="arrow size-[18px]" />
          </button>
        ) : (
          <>
            <button type="submit" value="whatsapp" className={buttonClass("dark")}>
              <WhatsApp className="size-5" />
              Send on WhatsApp
            </button>
            <button type="submit" value="email" className={buttonClass("outlineDark")}>
              <Mail className="size-5" />
              Send by email
            </button>
          </>
        )}
      </div>

      {step === STEP_LABELS.length - 1 && (
        <p className="mt-4 text-sm text-slate" role="status">
          {sentBy
            ? `Your request is ready in ${sentBy === "whatsapp" ? "WhatsApp" : "your email app"}. Press send there and we will get back to you.`
            : "Your request opens in WhatsApp or your email app, ready to send. Nothing is saved on this website."}
        </p>
      )}
    </form>
  );
}

function WizardFromLink({ plans }: { plans: Record<string, string[]> }) {
  const params = useSearchParams();
  const need = params.get("need") ?? "";
  const plan = params.get("plan") ?? "";
  return <Wizard initialNeed={NEEDS.some((item) => item.value === need) ? need : ""} initialPlan={plans[need]?.includes(plan) ? plan : ""} />;
}

/** A service or pricing page can link here with its choice already made. Search params need a Suspense boundary. */
export function QuoteWizard({ plans }: { plans: Record<string, string[]> }) {
  return (
    <Suspense fallback={<Wizard />}>
      <WizardFromLink plans={plans} />
    </Suspense>
  );
}
