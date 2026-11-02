import { LiveProjects } from "@/components/projects/LiveProjects";
import { ProjectsEmpty } from "@/components/projects/ProjectsEmpty";
import { LinkCards } from "@/components/site/LinkCards";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description: "Websites, web apps and custom software built by CodeRoot Solutions for growing businesses.",
  path: "/projects",
});

const caseStudyParts = [
  { title: "The problem", body: "What the business needed, and what was getting in the way." },
  { title: "What we built", body: "The website or software itself, with real screenshots." },
  { title: "How it turned out", body: "What changed for the business, in plain words and without inflated numbers." },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="Our work" title="Projects" crumbs={[{ name: "Projects", path: "/projects" }]} shapes={["gallery"]}>
        Real work for real businesses, added here as each one goes live.
      </PageHero>

      <section className="section-y">
        <div className="shell">
          <LiveProjects
            empty={
              <>
                <ProjectsEmpty heading="h2" />
                <SectionHead id="parts-heading" eyebrow="Coming here" title="What each case study will show" className="mt-20" />
                <ol className="mt-10 grid gap-5 md:grid-cols-3" aria-labelledby="parts-heading">
                  {caseStudyParts.map((part, index) => (
                    <li key={part.title} className="rounded-2xl border border-line p-7" data-reveal style={{ "--i": index } as React.CSSProperties}>
                      <span aria-hidden="true" className="font-display text-lg font-bold text-teal-deep">
                        0{index + 1}
                      </span>
                      <h3 className="mt-2 text-2xl">{part.title}</h3>
                      <p className="mt-2 text-slate">{part.body}</p>
                    </li>
                  ))}
                </ol>
              </>
            }
          />
        </div>
      </section>

      <section className="below-fold bg-neutral section-y" aria-label="Keep reading">
        <div className="shell">
          <LinkCards
            onTint
            items={[
              { href: "/services", label: "What we build", body: "Websites, web apps and custom software." },
              { href: "/how-we-work", label: "How we work", body: "The same six clear steps, every project." },
              { href: "/technology", label: "This website is our first example", body: "See what it is built with, and why." },
            ]}
          />
        </div>
      </section>

      <SimpleCta />
    </>
  );
}
