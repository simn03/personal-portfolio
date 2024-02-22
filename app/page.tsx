import SplashPage from "./ui/pages/Splash.page";
import ProjectsPage from "./ui/pages/Projects.page";
import CoursesPage from "./ui/pages/Courses.page";

export const metadata = {
    title: 'Simrit Nijjar'
}

export default function Page() {

    return (

        <div className='flex flex-col gap-10 m-auto dark:text-blue-200 text-slate-600'>

            <SplashPage />

            <ProjectsPage />

            <CoursesPage />

        </ div >

    );

}
