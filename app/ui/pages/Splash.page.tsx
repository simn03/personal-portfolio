import { FaGithub, FaLinkedin } from "react-icons/fa";
import RevealOnScroll from "../components/home/RevealOnScroll.component";
import ScrollButton from "../components/home/ScrollButton.component";
import TypeEffect from "../components/home/TypeEffect.component";
import CaretDown from "../components/icons/CaretDownDouble.icon";

export default function SplashPage() {
  return (
    <section className="document-padding flex min-h-[calc(100vh-5rem)] flex-col">
      <RevealOnScroll className="m-auto flex flex-col place-items-center gap-10 text-2xl sm:text-3xl lg:gap-14">
        <TypeEffect
          className="flex min-h-20 max-w-4xl flex-col text-center leading-relaxed"
          phrase="Sim is a student"
          phrases={[
            "majoring in Computer Science at UBC",
            "minoring in Data Science at UBC",
            "building full-stack software",
          ]}
        />

        <div className="flex items-center justify-center gap-10 text-3xl">
          <a href="https://github.com/simn03" target="_blank" rel="noreferrer" aria-label="Sim on GitHub" className="transition-colors hover:text-teal-600 dark:hover:text-teal-300">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/sim-n/" target="_blank" rel="noreferrer" aria-label="Sim on LinkedIn" className="transition-colors hover:text-teal-600 dark:hover:text-teal-300">
            <FaLinkedin />
          </a>
        </div>
      </RevealOnScroll>

      <ScrollButton
        className="mx-auto flex flex-col pb-4 text-center text-sm text-teal-600 underline underline-offset-4 transition-all hover:underline-offset-8 dark:text-teal-300"
        elementID="work"
      >
        Scroll to Work
        <CaretDown
          className="mx-auto mt-3 animate-bounce opacity-75"
          innerClassName="stroke-teal-600 dark:stroke-teal-300"
        />
      </ScrollButton>
    </section>
  );
}
