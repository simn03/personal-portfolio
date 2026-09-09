import SplashPage from "./ui/pages/Splash.page";
import ProjectsPage from "./ui/pages/Projects.page";
import CoursesPage from "./ui/pages/Courses.page";
import WorkPage from "./ui/pages/Work.page";

export const metadata = {
  title: 'Simrit Nijjar'
}

export default function Page() {

  return (

    <div className='m-auto flex flex-col gap-12 pb-16 text-slate-600 dark:text-blue-200 sm:gap-20'>

      <SplashPage />

      <WorkPage />

      <ProjectsPage />

      <CoursesPage />

    </ div >

  );

}
