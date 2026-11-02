import type { Metadata } from "next";
import { ProjectView } from "@/components/projects/ProjectView";
import { SimpleCta } from "@/components/site/SimpleCta";

/**
 * The shell for every /projects/<slug> address. Laravel serves it with that project's own title,
 * description, share image and canonical link, and ProjectView sets them again in the browser,
 * since React puts back the shell's own title when the page starts. No robots tag here: it would
 * come back the same way and hide every project from search engines.
 */
export const metadata: Metadata = {
  title: "Project",
  description: "A project by CodeRoot Solutions.",
  alternates: {},
};

export default function ProjectPage() {
  return (
    <>
      <ProjectView />
      <SimpleCta />
    </>
  );
}
