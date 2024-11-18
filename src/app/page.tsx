
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import VideoControls from "@/components/VideoControls";
import { SidebarProvider } from "@/context/SidebarContext";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex flex-col-reverse lg:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 w-full p-8">
          <VideoPlayer videoId="" />
          <VideoControls />
        </div>
      </div>
    </SidebarProvider>
  );
}
