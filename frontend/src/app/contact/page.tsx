import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd, faqSchema } from "@/components/seo/JsonLd";
import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { Faq } from "@/components/ui/Faq";
import { Facebook, Instagram, LinkedIn, Mail, MapPin, Phone, TikTok, WhatsApp } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";
import { generalFaqs } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Our Web Developers",
  description:
    "Contact CodeRoot Solutions about your website, web app or custom software. Call, WhatsApp or email us from anywhere in Sri Lanka.",
  path: "/contact",
  keywords: [
    "contact a web developer in Sri Lanka",
    "hire web developers Sri Lanka",
    "software developers Sri Lanka",
    "website development enquiry",
  ],
});

const channels = [
  { label: "Call us", value: site.phone.display, href: site.phone.href, Icon: Phone, external: false },
  { label: "WhatsApp", value: site.phone.international, href: site.whatsapp.href, Icon: WhatsApp, external: true },
  { label: "Email", value: site.email, href: `mailto:${site.email}`, Icon: Mail, external: false },
];

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: Facebook },
  { label: "Instagram", href: site.social.instagram, Icon: Instagram },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedIn },
  { label: "TikTok", href: site.social.tiktok, Icon: TikTok },
];

const nextSteps = [
  { title: "You get in touch", body: "However suits you: a call, a WhatsApp message or an email. A rough idea is enough." },
  { title: "We talk it through", body: "We ask about your business and what you want to change, in plain words." },
  { title: "You get a free quote", body: "A written quote with a clear scope and timeline, and no pressure to say yes." },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqSchema(generalFaqs)} />

      <PageHero eyebrow="Contact" title="Have a project in mind?" crumbs={[{ name: "Contact", path: "/contact" }]} shapes={["bubble"]}>
        Call, message or write to us. We would be glad to hear about what you are working on.
      </PageHero>

      <section className="section-y">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="min-w-0">
            <h2 className="display heading-lg">Talk to us</h2>
            <ul className="mt-7 space-y-3">
              {channels.map(({ label, value, href, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex min-h-[4.5rem] items-center gap-4 rounded-xl bg-neutral p-4 transition-colors duration-200 hover:bg-teal-light"
                  >
                    <span className="grid size-11 flex-none place-items-center rounded-lg bg-white text-teal-deep">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-slate">{label}</span>
                      <span className="block break-words font-semibold">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex min-h-[4.5rem] items-center gap-4 rounded-xl bg-neutral p-4">
                <span className="grid size-11 flex-none place-items-center rounded-lg bg-white text-teal-deep">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-slate">Address</span>
                  <span className="block font-semibold">
                    {site.address.street}, {site.address.postalCode}, {site.address.country}
                  </span>
                </span>
              </li>
            </ul>

            <h3 className="mt-9 text-lg">Follow us</h3>
            <ul className="mt-3 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CodeRoot Solutions on ${label}`}
                    className="grid size-11 place-items-center rounded-lg border border-line text-slate transition-colors duration-200 hover:border-teal-deep hover:text-teal-deep"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="below-fold bg-charcoal text-white section-y" aria-labelledby="next-heading">
        <div className="shell">
          <SectionHead id="next-heading" tone="dark" eyebrow="What happens next" title="Three simple steps" />
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {nextSteps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-teal pt-5" data-reveal style={{ "--i": index } as React.CSSProperties}>
                <span aria-hidden="true" className="font-display text-lg font-bold text-teal">
                  0{index + 1}
                </span>
                <h3 className="mt-2 text-2xl">{step.title}</h3>
                <p className="mt-2 text-mist">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="contact-faq">
        <div className="shell max-w-4xl">
          <h2 id="contact-faq" className="display heading-lg mb-8">
            Common questions
          </h2>
          <Faq items={generalFaqs} />
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-label="Other ways to start">
        <div className="shell">
          <LinkCards
            onTint
            items={[
              { href: "/quote", label: "Use the quote form", body: "A few short questions, about two minutes. It gives us what we need to reply properly." },
              { href: "/faq", label: "All questions and answers", body: "Cost, timing, how we work and what happens after launch." },
            ]}
          />
        </div>
      </section>
    </>
  );
}
