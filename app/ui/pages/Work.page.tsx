import Section from "../components/section/Section.component";
import RevealOnScroll from "../components/home/RevealOnScroll.component";
import { workItems } from "@/lib/data/work";

export default function WorkPage() {
  return (
    <RevealOnScroll>
      <Section
        className="mt-20 flex flex-col gap-10"
        id="work"
        header="Work"
        tagline="places i've worked and what i built while i was there"
        items={workItems}
        variant="list"
      />
    </RevealOnScroll>
  );
}
