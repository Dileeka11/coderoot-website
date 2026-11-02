"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/seo/JsonLd";
import { ExternalButton } from "@/components/ui/Button";
import { ArrowRight, ExternalLink } from "@/components/ui/icons";
import { SlantDivider } from "@/components/ui/SlantDivider";
import { Watermark } from "@/components/ui/Watermark";
import { getProject, mediaUrl, safeExternalUrl, type Project } from "@/lib/api";
import { site } from "@/lib/site";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; project: Project };

/**
 * One page serves every project. Laravel sends it for /projects/<slug> with that project's title,
 * description and share image already in the head, and the content is read here from the API.
 */
export function ProjectView() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const slug = decodeURIComponent(window.location.pathname.replace(/\/$/, "").split("/").pop() ?? "");
    let active = true;
    getProject(slug)
      .then((project) => active && setState(project ? { status: "ready", project } : { status: "missing" }))
      .catch(() => active && setState({ status: "missing" }));
    return () => {
      active = false;
    };
  }, []);

  // React restores the shell's generic head after Laravel wrote the project's own, so it is set again here.
  useEffect(() => {
    if (state.status !== "ready") return;
    const { project } = state;
    document.title = `${project.title} | ${site.name}`;
    document.querySelectorAll('meta[name="description"]').forEach((meta) => meta.setAttribute("content", project.summary));
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = `${site.url}/projects/${project.slug}`;
  }, [state]);

  if (state.status === "loading") return <div className="min-h-[70svh] bg-charcoal" aria-busy="true" />;

  if (state.status === "missing") {
    return (
      <section className="section-y">
        <div className="shell max-w-2xl">
          <h1 className="display heading-lg">This project could not be loaded</h1>
          <p className="lead mt-4 text-slate">It may have been moved, or the connection dropped. Try again, or see all our projects.</p>
          <Link href="/projects" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep">
            All projects
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    );
  }

  const { project } = state;
  const path = `/projects/${project.slug}`;
  const liveUrl = safeExternalUrl(project.live_url);
  const paragraphs = (project.description ?? "").split(/\n\s*\n/).filter(Boolean);
  const gallery = project.gallery ?? [];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.summary,
          url: `${site.url}${path}`,
          image: `${site.url}${mediaUrl(project.cover)}`,
          creator: { "@id": organizationId },
          ...(project.published_at ? { datePublished: project.published_at } : {}),
          ...(project.updated_at ? { dateModified: project.updated_at } : {}),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path },
        ])}
      />

      <section className="clip-box relative isolate bg-charcoal text-white">
        <Watermark className="-right-[8%] top-1/2 -z-10 w-[62rem] max-w-[120%] -translate-y-1/2" />
        <div className="shell pb-[clamp(6.5rem,13vw,11rem)] pt-[clamp(3rem,7vw,5.5rem)]">
          <Link href="/projects" className="flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-mist hover:text-teal">
            <ArrowRight className="size-[18px] rotate-180" />
            All projects
          </Link>
          <p className="eyebrow rise mt-5 flex text-mist">
            {project.category.label}
            {project.year ? ` · ${project.year}` : ""}
          </p>
          <h1 className="display heading-xl rise mt-5 max-w-4xl" style={{ "--i": 1 } as React.CSSProperties}>
            {project.title}
          </h1>
          <p className="lead rise mt-6 max-w-2xl text-mist" style={{ "--i": 2 } as React.CSSProperties}>
            {project.summary}
          </p>
        </div>
        <SlantDivider />
      </section>

      <section className="section-y !pt-10 sm:!pt-14">
        <div className="shell">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral">
            <Image src={mediaUrl(project.cover)} alt={`${project.title} project`} fill priority sizes="(min-width: 1320px) 1224px, 92vw" className="object-cover" />
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div className="space-y-5 text-lg">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
            <aside className="h-fit rounded-2xl bg-neutral p-7">
              {project.client && (
                <div className="mb-6">
                  <h2 className="font-sans text-sm font-semibold text-slate">Client</h2>
                  <p className="mt-1 font-medium">{project.client}</p>
                </div>
              )}
              {project.tech_stack.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-sans text-sm font-semibold text-slate">Built with</h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <li key={tech} className="rounded-md bg-teal-light px-2.5 py-1 text-sm font-medium text-charcoal">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {liveUrl && (
                <ExternalButton href={liveUrl} variant="dark" className="w-full">
                  Visit the live site
                  <ExternalLink className="size-[18px]" />
                </ExternalButton>
              )}
            </aside>
          </div>

          {gallery.length > 0 && (
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {gallery.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral"
                  data-reveal
                  style={{ "--i": index % 2 } as React.CSSProperties}
                >
                  <Image src={mediaUrl(image)} alt={`${project.title} screenshot ${index + 1}`} fill sizes="(min-width: 768px) 46vw, 92vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
