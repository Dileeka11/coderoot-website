import { LiveProjects } from "@/components/projects/LiveProjects";
import { ProjectsEmpty } from "@/components/projects/ProjectsEmpty";
import { FlipWords } from "@/components/ui/FlipWords";

const PREVIEW_COUNT = 3;

export function ProjectsPreview() {
  return (
    <section className="below-fold section-y bg-white" aria-labelledby="projects-heading">
      <div className="shell">
        <p className="eyebrow text-teal-deep" data-reveal>
          Our work
        </p>
        <h2 id="projects-heading" className="display heading-xl mt-5" data-flip>
          <FlipWords text="Projects" />
        </h2>

        <div className="mt-12">
          <LiveProjects empty={<ProjectsEmpty />} limit={PREVIEW_COUNT} />
        </div>
      </div>
    </section>
  );
}
