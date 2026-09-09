import SplashPage from "./ui/pages/Splash.page";
import ProjectsPage from "./ui/pages/Projects.page";
import CoursesPage from "./ui/pages/Courses.page";
import WorkPage from "./ui/pages/Work.page";
import WeeklyMusic from "./ui/components/music/WeeklyMusic.component";
import RecentlyWatched from "./ui/components/tv/RecentlyWatched.component";
import RecentlyReading from "./ui/components/books/RecentlyReading.component";
import OrnamentDivider from "@/components/ui/ornament-divider";

export const metadata = {
  title: "Simrit Nijjar",
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <SplashPage />

      <WeeklyMusic />

      <RecentlyWatched />

      <RecentlyReading />

      <OrnamentDivider className="document-padding py-4" glyph="♪" />

      <WorkPage />

      <OrnamentDivider className="document-padding py-4" glyph="✦" />

      <ProjectsPage />

      <OrnamentDivider className="document-padding py-4" glyph="✦" />

      <CoursesPage />
    </div>
  );
}
