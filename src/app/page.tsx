
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import { SidebarProvider } from "@/context/SidebarContext";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex flex-col-reverse lg:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 w-full p-8">
          <VideoPlayer videoId="" />
        </div>
      </div>
    </SidebarProvider>
  );
}
