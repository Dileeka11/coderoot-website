import { ContactCta } from "@/components/home/ContactCta";
import { Hero } from "@/components/home/Hero";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";
import { PromisePanel } from "@/components/home/PromisePanel";
import { ServicesTree } from "@/components/home/ServicesTree";
import { TechLogos } from "@/components/home/TechLogos";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesTree />
      <PromisePanel />
      <TechLogos />
      <ProjectsPreview />
      <ContactCta />
    </>
  );
}
