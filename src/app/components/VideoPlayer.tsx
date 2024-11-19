"use client"
import { useSidebar } from "@/context/SidebarContext"
import { useCallback, useEffect, useRef, useState } from "react"

type VideoPlayerProps = {
  videoId?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({}) => {
  const { selectedVideo } = useSidebar()
  const iframeRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  const onPlayerReady = () => {
    setIsPlayerReady(true)
  }

  const initializePlayer = useCallback(() => {
    if (selectedVideo && iframeRef.current) {
      if (playerRef.current) {
        playerRef.current.destroy()
      }

      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: selectedVideo,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
        },
      })
    }
  }, [selectedVideo])

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(script)

      script.onload = () => {
        window.onYouTubeIframeAPIReady = initializePlayer
      }
    } else {
      initializePlayer()
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [initializePlayer, selectedVideo])

  const handlePlayPause = () => {
    if (!isPlayerReady || !playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="video-player relative">
      <div ref={iframeRef} className="w-full h-[315px] lg:h-[450px]">{!selectedVideo && "Please select a video!"}</div>
      <div className="video-controls mt-4 flex space-x-4">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  )
}

export default VideoPlayer
