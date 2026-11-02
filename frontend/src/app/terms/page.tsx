import { PageHero } from "@/components/site/PageHero";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms for using the CodeRoot Solutions website, in plain words.",
  path: "/terms",
});

const sections = [
  {
    title: "About these terms",
    body: `These terms cover your use of this website, which is run by ${site.name} in ${site.address.country}. By using the site, you agree to them. They do not cover the work we do for clients. That is set out in a written proposal for each project.`,
  },
  {
    title: "Information on this site",
    body: "We try to keep everything here accurate and up to date, but it is general information and not advice for your specific situation. Examples of what we can build are examples, not promises of a particular result.",
  },
  {
    title: "Quotes and projects",
    body: "Nothing on this website is an offer or a contract. A project only starts once we have both agreed a written proposal, which sets out the scope, timeline, cost and other terms.",
  },
  {
    title: "Using this site",
    body: "Please do not try to break, overload or gain unauthorised access to the site, or use it for anything unlawful.",
  },
  {
    title: "Our content and brand",
    body: `The text, design, code and graphics on this site, and the ${site.name} name and logo, belong to us unless we say otherwise. You are welcome to share links to our pages, but please ask before reusing anything else.`,
  },
  {
    title: "Links to other websites",
    body: "We link to some other services, such as WhatsApp and social media. We do not control those sites and are not responsible for what they do or for their terms.",
  },
  {
    title: "No guarantee",
    body: "We work to keep this site available and secure, but we cannot promise it will always be free of errors or interruptions. As far as the law allows, we are not responsible for loss caused by relying on this site.",
  },
  {
    title: "Changes",
    body: "We may update these terms from time to time. The date below shows when they last changed.",
  },
  {
    title: "Governing law",
    body: `These terms are governed by the laws of ${site.address.country}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Terms" title="Terms of use, in plain words" crumbs={[{ name: "Terms of use", path: "/terms" }]} />
      <section className="section-y !pt-8">
        <div className="shell max-w-3xl space-y-8 text-lg">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-2xl">{section.title}</h2>
              <p className="mt-3 text-slate">{section.body}</p>
            </div>
          ))}
          <div>
            <h2 className="text-2xl">Questions</h2>
            <p className="mt-3 text-slate">
              Email us at{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-teal-deep underline underline-offset-2">
                {site.email}
              </a>{" "}
              and we will be happy to help.
            </p>
          </div>
          <p className="text-base text-slate">Last updated: 2 November 2026</p>
        </div>
      </section>
    </>
  );
}
