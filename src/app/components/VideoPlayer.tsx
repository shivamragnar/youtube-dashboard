"use client"
import { useSidebar } from "@/context/SidebarContext"
import { useCallback, useEffect, useRef, useState } from "react"
import Slider from "@/components/Slider"

type VideoPlayerProps = {
  videoId?: string
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({}) => {
  const { selectedVideo } = useSidebar()
  const iframeRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [duration, setDuration] = useState(0)

  const startTimeRef = useRef<number>(0)
  const endTimeRef = useRef<number>(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const onPlayerReady = (event: any) => {
    setIsPlayerReady(true);
    event.target.pauseVideo()
    if (playerRef.current) {
      const videoDuration = playerRef.current.getDuration();
      if (videoDuration) {
        setDuration(videoDuration);
        startTimeRef.current = 0
        endTimeRef.current = videoDuration
      }
    }
  }

  const handlePlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (playerRef.current && playerRef.current.getCurrentTime) {
        intervalRef.current = setInterval(() => {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime >= endTimeRef.current) {
            setIsPlaying(false);
            playerRef.current.pauseVideo();
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          }
        }, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (event.data === window.YT.PlayerState.PAUSED) {
        setIsPlaying(false);
      } else if (event.data === window.YT.PlayerState.ENDED) {
        handleRestartVideo();
      }
    }
  }

  const initializePlayer = useCallback(() => {
    if (selectedVideo && iframeRef.current) {
      if (playerRef.current) {
        playerRef.current.destroy()
        setIsPlayerReady(false)
      }

      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: selectedVideo,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          autoplay: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: handlePlayerStateChange,
        },
      })
    }
  }, [selectedVideo])

  useEffect(() => {
    console.log('useEffect 1')
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

  const handleRestartVideo = () => {
    playerRef.current.seekTo(startTimeRef.current, true)
    playerRef.current.playVideo()
  }

  const handlePlayPause = () => {
    if (!isPlayerReady || !playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.seekTo(startTimeRef.current, true)
      playerRef.current.playVideo()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSliderChange = useCallback((values: { min: number; max?: number }) => {
    startTimeRef.current = values.min
    endTimeRef.current = values.max ?? duration
    if (playerRef.current) {
      if (isPlayerReady) { 
        playerRef.current.seekTo(startTimeRef.current, true)
      }
    }
  }, [selectedVideo, isPlayerReady])


  return (
    <div className="video-player relative">
      <div ref={iframeRef} className="w-full h-[315px] lg:h-[450px] flex items-center justify-center">
        {!selectedVideo && "Please select a video!"}
      </div>
      <div className="video-controls mt-4 flex items-center gap-2 space-x-4">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <Slider
          min={0}
          max={duration}
          value={{ min: startTimeRef.current, max: endTimeRef.current }}
          onChange={handleSliderChange}
          renderLabel={formatTime}
        />
      </div>
    </div>
  )
}

export default VideoPlayer