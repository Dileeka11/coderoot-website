import { PlanCard } from "@/components/pricing/PlanCard";
import { PricingTabs } from "@/components/pricing/PricingTabs";
import { JsonLd, faqSchema, organizationId } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { Faq } from "@/components/ui/Faq";
import { faqGroups } from "@/lib/faqs";
import { pricing } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Web Design & SEO Pricing in Sri Lanka",
  description:
    "Web development from Rs. 30,000, SEO from Rs. 13,000 a month, social media from Rs. 5,000 a month and graphic design from Rs. 3,000. See each package.",
  path: "/pricing",
  keywords: [
    "web design price in Sri Lanka",
    "website development cost Sri Lanka",
    "website packages Sri Lanka",
    "SEO packages Sri Lanka",
    "SEO services Sri Lanka",
    "social media marketing packages Sri Lanka",
    "graphic design price Sri Lanka",
  ],
});

const priceFactors = [
  {
    title: "How much there is to build",
    body: "More pages, screens or types of user mean more design, building and testing.",
  },
  {
    title: "The features you need",
    body: "Online payments, bookings and connections to other systems each add work.",
  },
  {
    title: "What you already have",
    body: "Ready content, a logo or an existing system can save time. Starting from nothing takes longer.",
  },
];

const questions = faqGroups.find((group) => group.id === "cost-and-timing")?.items ?? [];

/** Only prices that have been set are offered to search engines */
const offers = pricing.flatMap((group) =>
  group.plans
    .filter((plan) => plan.price !== null)
    .map((plan) => ({
      "@type": "Offer",
      name: `${group.title.replace(" packages", "")}: ${plan.name}`,
      price: plan.price,
      priceCurrency: "LKR",
      ...(plan.per && { priceSpecification: { "@type": "UnitPriceSpecification", price: plan.price, priceCurrency: "LKR", unitCode: "MON" } }),
      seller: { "@id": organizationId },
    })),
);

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema(questions)} />
      {offers.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "OfferCatalog", name: "CodeRoot Solutions packages", itemListElement: offers }} />}

      <PageHero eyebrow="Pricing" title="Clear packages, no surprises" crumbs={[{ name: "Pricing", path: "/pricing" }]} shapes={["tag"]}>
        See what each package includes. Your free written quote confirms the final price before work starts.
      </PageHero>

      <section className="section-y" aria-label="Packages">
        <div className="shell">
          <PricingTabs
            panels={pricing.map((group) => ({
              id: group.slug,
              label: group.tab,
              content: (
                <>
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="display heading-lg">{group.title}</h2>
                    <p className="lead mt-3 text-slate">{group.lead}</p>
                  </div>
                  <ul className={`mt-10 grid gap-6 ${group.plans.length === 4 ? "md:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3"}`}>
                    {group.plans.map((plan, index) => (
                      <PlanCard key={plan.name} plan={plan} need={group.slug} tab={group.tab} index={index} />
                    ))}
                  </ul>
                  {group.note && <p className="mt-6 text-center font-semibold text-teal-deep">{group.note}</p>}
                </>
              ),
            }))}
          />
          <p className="mt-8 text-center text-sm text-slate">Prices may change based on what you need. Your written quote confirms the final price.</p>
        </div>
      </section>

      <section className="below-fold bg-teal-light section-y" aria-labelledby="factors-heading">
        <div className="shell">
          <SectionHead id="factors-heading" tone="tint" eyebrow="Your final price" title="What can change the price" />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {priceFactors.map((factor, index) => (
              <li key={factor.title} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <div className="h-full rounded-2xl bg-white p-7" data-tilt>
                  <h3 className="text-xl">{factor.title}</h3>
                  <p className="mt-2 text-slate">{factor.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="below-fold section-y" aria-labelledby="pricing-faq">
        <div className="shell max-w-4xl">
          <h2 id="pricing-faq" className="display heading-lg mb-8">
            Common questions
          </h2>
          <Faq items={questions} />
        </div>
      </section>

      <SimpleCta title="Need something custom?" />
    </>
  );
}
