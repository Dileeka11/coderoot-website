import Link from "next/link";
import { QuoteWizard } from "@/components/contact/QuoteWizard";
import { PageHero } from "@/components/site/PageHero";
import { Mail, Phone, WhatsApp } from "@/components/ui/icons";
import { planNames } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Get a Free Quote",
  description:
    "Tell CodeRoot Solutions what you need and get a free quote for your website, web app or custom software. It takes about two minutes.",
  path: "/quote",
});

const nextSteps = [
  { title: "We read your request", body: "and reply with any questions." },
  { title: "We talk it through", body: "so we understand what you really need." },
  { title: "You get a free written quote", body: "with a clear scope and timeline." },
];

const channels = [
  { label: site.phone.display, href: site.phone.href, Icon: Phone, external: false },
  { label: "WhatsApp", href: site.whatsapp.href, Icon: WhatsApp, external: true },
  { label: site.email, href: `mailto:${site.email}`, Icon: Mail, external: false },
];

export default function QuotePage() {
  return (
    <>
      <PageHero eyebrow="Free quote" title="Tell us what you need" crumbs={[{ name: "Get a free quote", path: "/quote" }]}>
        A few short questions, about two minutes. You do not need to know the technical details.
      </PageHero>

      <section className="section-y !pt-8 sm:!pt-12">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
          <div className="min-w-0">
            <noscript>
              <p className="mb-5 rounded-xl bg-teal-light p-5">
                This form needs JavaScript. You can still reach us by phone, WhatsApp or email, using the details on this page.
              </p>
            </noscript>
            <QuoteWizard plans={planNames} />
          </div>

          <aside className="h-fit space-y-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            <div className="rounded-2xl bg-neutral p-7">
              <h2 className="text-xl">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span aria-hidden="true" className="font-display font-bold text-charcoal">
                      0{index + 1}
                    </span>
                    <p className="leading-snug">
                      <span className="font-semibold">{step.title}</span> <span className="text-slate">{step.body}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-line p-7">
              <h2 className="text-xl">Prefer to talk?</h2>
              <ul className="mt-3">
                {channels.map(({ label, href, Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex min-h-11 items-center gap-3 break-all font-medium transition-colors duration-200 hover:text-teal-deep"
                    >
                      <Icon className="size-5 flex-none text-teal-deep" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate">
                Not ready for a quote?{" "}
                <Link href="/insights/prepare-for-a-website-quote" className="font-medium text-teal-deep underline underline-offset-2">
                  Here is what to prepare
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
