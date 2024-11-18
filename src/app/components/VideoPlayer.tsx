'use client'
import { useSidebar } from "@/context/SidebarContext";

type VideoPlayerProps = {
  videoId: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const { selectedVideo } =  useSidebar()
  const embedUrl = `https://www.youtube.com/embed/${selectedVideo}?controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1&autoplay=0`;

  return (
    <div className="video-player w-full h-[350px] lg:h-[450px] relative">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-md"
      ></iframe>
    </div>
  )
}

export default VideoPlayer
