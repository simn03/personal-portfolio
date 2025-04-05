import Section from "../components/section/Section.component";
import RevealOnScroll from "../components/home/RevealOnScroll.component";

export default function CoursesPage() {
  return (
    <>
      <RevealOnScroll>

        <Section
          className={`flex flex-col gap-10 mt-screen`}
          id={`courses`}
          header={`Courses`}
          tagline={`Courses taken at UBC relating to Computer Science and Data Science`}
          items={[
            {
              title: "Computation, Programs, and Programming",
              metadata: ["CPSC 110", "UBC", "2021", "A+"],
              description: [
                "Fundamental program and computation structures.",
                "Introductory programming skills.",
                "Computation as a tool for information processing, simulation and modelling, and interacting with the world.",
              ]
            },
            {
              title: "Models of Computation",
              metadata: ["CPSC 121", "UBC", "2022", "B+"],
              description: [
                "Physical and mathematical structures of computation.",
                "Boolean algebra and combinations logic circuits; proof techniques; functions and sequential circuits; sets and relations; finite state machines; sequential instruction execution.",
              ]
            },
            {
              title: "Software Construction",
              metadata: ["CPSC 210", "UBC", "2022", "A+"],
              description: [
                "Design, development, and analysis of robust software components.",
                "Topics such as software design, computational models, data structures, debugging, and testing.",
              ]
            },
            {
              title: "Introduction to Computer Systems",
              metadata: ["CPSC 213", "UBC", "2022", "A+"],
              description: [
                "Software architecture, operating systems, and I/O architectures.",
                "Relationships between application software, operating systems, and computing hardware; critical sections, deadlock avoidance, and performance; principles and operation of disks and networks.",
              ]
            },
            {
              title: "Basic Algorithms and Data Structures",
              metadata: ["CPSC 221", "UBC", "2023", "A+"],
              description: [
                "Design and analysis of basic algorithms and data structures; algorithm analysis methods, searching and sorting algorithms, basic data structures, graphs and concurrency.",
              ]
            },
            {
              title: "Differential Calculus with Applications",
              metadata: ["MATH 100", "UBC", "2021", "B"],
              description: [
                "Derivatives of elementary functions. Applications and modelling: graphing, optimization.",
              ]
            },
            {
              title: "Integral Calculus with Applications",
              metadata: ["MATH 101", "UBC", "2022", "A-"],
              description: [
                "The definite integral, integration techniques, applications, modelling, infinite series.",
              ]
            },
            {
              title: "Calculus III",
              metadata: ["MATH 200", "UBC", "2022", "A+"],
              description: [
                "Analytic geometry in 2 and 3 dimensions, partial and directional derivatives, chain rule, maxima and minima, second derivative test, Lagrange multipliers, multiple integrals with applications.",
              ]
            },
            {
              title: "Matrix Algebra",
              metadata: ["MATH 221", "UBC", "2023", "A"],
              description: [
                "Systems of linear equations, operations on matrices, determinants, eigenvalues and eigenvectors, diagonalization of symmetric matrices",
              ]
            },
          ]}
        />

        <h1 className='text-center pt-5 opacity-70 text-sm'> All course names & descriptions are originally from <a target='_blank' href='https://courses.students.ubc.ca'> courses.students.ubc.ca</a>  as of 2023/09/20 </h1>

      </RevealOnScroll>
    </>
  )
}