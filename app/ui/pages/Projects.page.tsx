import Section from "../components/section/Section.component";
import RevealOnScroll from "../components/home/RevealOnScroll.component";
import { projects } from "@/lib/data/projects";

export default function ProjectsPage() {
  return (
    <RevealOnScroll>
      <Section
        className="mt-20 flex flex-col gap-10"
        id="projects"
        header="Projects"
        tagline="things i've built — side projects, experiments, and the odd rabbit hole"
        items={projects}
      />
    </RevealOnScroll>
  );
}
