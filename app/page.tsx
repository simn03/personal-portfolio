import SplashPage from "./ui/pages/Splash.page";
import ProjectsPage from "./ui/pages/Projects.page";
import CoursesPage from "./ui/pages/Courses.page";
import WorkPage from "./ui/pages/Work.page";
import WeeklyMusic from "./ui/components/music/WeeklyMusic.component";
import MusicStats from "./ui/components/music/MusicStats.component";
import RecentlyWatched from "./ui/components/tv/RecentlyWatched.component";
import WatchStats from "./ui/components/tv/WatchStats.component";
import RecentlyReading from "./ui/components/books/RecentlyReading.component";
import ReadingActivity from "./ui/components/books/ReadingActivity.component";
import OrnamentDivider from "@/components/ui/ornament-divider";

export const metadata = {
  title: "Simrit Nijjar",
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <SplashPage />

      <WeeklyMusic />

      <MusicStats />

      <RecentlyWatched />

      <WatchStats />

      <RecentlyReading />

      <ReadingActivity />

      <OrnamentDivider className="document-padding py-4" glyph="♪" />

      <WorkPage />

      <OrnamentDivider className="document-padding py-4" glyph="✦" />

      <ProjectsPage />

      <OrnamentDivider className="document-padding py-4" glyph="✦" />

      <CoursesPage />
    </div>
  );
}
