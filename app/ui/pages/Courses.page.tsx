import Section from "../components/section/Section.component";
import RevealOnScroll from "../components/home/RevealOnScroll.component";
import { courseItems } from "@/lib/data/courses";

export default function CoursesPage() {
  return (
    <RevealOnScroll>
      <Section
        className="mt-20 flex flex-col gap-10"
        id="courses"
        header="Courses"
        tagline="courses i've taken at ubc — filter by code, grade, year, or skill"
        items={courseItems}
        variant="course"
      />

      <p className="pt-5 text-center text-sm text-muted-foreground">
        all course names &amp; descriptions are originally from{" "}
        <a
          className="link-accent"
          target="_blank"
          rel="noreferrer"
          href="https://courses.students.ubc.ca"
        >
          courses.students.ubc.ca
        </a>{" "}
        as of 2023/09/20
      </p>
    </RevealOnScroll>
  );
}
