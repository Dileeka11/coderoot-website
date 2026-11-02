"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { getProjects, type Project } from "@/lib/api";
import { ProjectCard } from "./ProjectCard";

/**
 * The page is built ahead of time with the empty state, then swaps in the published projects
 * once they arrive. If the API cannot be reached, the empty state simply stays.
 */
export function LiveProjects({ empty, limit }: { empty: ReactNode; limit?: number }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let active = true;
    getProjects()
      .then((list) => active && setProjects(list))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (projects.length === 0) return empty;

  const shown = limit ? projects.slice(0, limit) : projects;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            large={limit !== undefined && index === 0 && shown.length !== 2}
            index={limit !== undefined ? index : index % 2}
          />
        ))}
      </div>
      {limit !== undefined && projects.length > limit && (
        <ButtonLink href="/projects" variant="outlineDark" arrow className="mt-10">
          See all projects
        </ButtonLink>
      )}
    </>
  );
}
