import Image from "next/image";
import { ArrowRight } from "@/components/ui/icons";
import { mediaUrl, type Project } from "@/lib/api";

interface ProjectCardProps {
  project: Project;
  large?: boolean;
  index?: number;
}

export function ProjectCard({ project, large = false, index = 0 }: ProjectCardProps) {
  return (
    <div className={large ? "md:col-span-2" : ""} data-reveal style={{ "--i": index } as React.CSSProperties}>
      <article className="h-full overflow-hidden rounded-2xl border border-line bg-white" data-tilt>
        {/* A plain link: Laravel serves project pages, so there is no prebuilt page data for Next.js to prefetch. */}
        <a href={`/projects/${project.slug}`} className="group block h-full">
          <div className={`relative overflow-hidden bg-neutral ${large ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[16/10]"}`}>
            <Image
              src={mediaUrl(project.cover)}
              alt={`${project.title} project`}
              fill
              sizes={large ? "(min-width: 1320px) 1224px, 92vw" : "(min-width: 1024px) 40vw, (min-width: 768px) 46vw, 92vw"}
              className="object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
            />
          </div>
          <div className="p-6 sm:p-7">
            <p className="text-sm font-semibold text-teal-deep">
              {project.category.label}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <h3 className="mt-2 text-2xl">{project.title}</h3>
            <p className="mt-2 text-slate">{project.summary}</p>
            <span className="mt-4 inline-flex items-center gap-2 font-semibold text-charcoal">
              View project
              <ArrowRight className="arrow size-[18px] text-teal-deep" />
            </span>
          </div>
        </a>
      </article>
    </div>
  );
}
