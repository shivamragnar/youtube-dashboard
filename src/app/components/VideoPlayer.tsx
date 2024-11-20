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

const loadYouTubeAPI = (initializePlayer: () => void) => {
  const script = document.createElement("script")
  script.src = "https://www.youtube.com/iframe_api"
  document.body.appendChild(script)
  script.onload = () => {
    window.onYouTubeIframeAPIReady = initializePlayer
  }
}

const createPlayer = (
  iframeRef: React.RefObject<HTMLDivElement>,
  videoId: string,
  onPlayerReady: (event: any) => void,
  handlePlayerStateChange: (event: any) => void
) => {
  return new window.YT.Player(iframeRef.current, {
    videoId,
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

const setupIntervalToCheckEndTime = (
  playerRef: React.RefObject<any>,
  endTimeRef: React.RefObject<number>,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  intervalRef: React.RefObject<NodeJS.Timeout | null>
) => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current)
  }
  if (playerRef.current && playerRef.current.getCurrentTime) {
    intervalRef.current = setInterval(() => {
      const currentTime = playerRef.current.getCurrentTime()
      if (endTimeRef.current !== null && currentTime >= endTimeRef.current) {
        // setIsPlaying(false);
        playerRef.current.pauseVideo()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, 1000)
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({}) => {
  const { selectedVideo } = useSidebar()
  const iframeRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [duration, setDuration] = useState(0)

  const startTimeRef = useRef<number>(0)
  const endTimeRef = useRef<number>(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const onPlayerReady = (event: YT.PlayerEvent) => {
    setIsPlayerReady(true)
    event.target.pauseVideo()
    if (playerRef.current) {
      const videoDuration = playerRef.current.getDuration()
      if (videoDuration) {
        setDuration(videoDuration)
        startTimeRef.current = 0
        endTimeRef.current = videoDuration
      }
    }
  }

  const handlePlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (playerRef.current && playerRef.current.getCurrentTime) {
        intervalRef.current = setInterval(() => {
          const currentTime = playerRef.current?.getCurrentTime()
          if (
            endTimeRef.current !== null &&
            currentTime >= endTimeRef.current
          ) {
            setIsPlaying(false)
            playerRef.current?.pauseVideo()
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
          }
        }, 1000)
      }
      // setupIntervalToCheckEndTime(playerRef, endTimeRef, () => setIsPlaying(false), intervalRef);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const initializePlayer = useCallback(() => {
    if (selectedVideo && iframeRef.current) {
      if (playerRef.current) {
        playerRef.current.destroy()
        setIsPlayerReady(false)
      }
      playerRef.current = createPlayer(
        iframeRef,
        selectedVideo,
        onPlayerReady,
        handlePlayerStateChange
      ) as unknown as typeof playerRef.current
    }
  }, [selectedVideo])

  useEffect(() => {
    if (!window.YT) {
      loadYouTubeAPI(initializePlayer)
    } else {
      initializePlayer()
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [initializePlayer, selectedVideo])

  const handlePlayPause = useCallback(() => {
    if (!isPlayerReady || !playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      console.log("before playeing", startTimeRef.current)
      playerRef.current.seekTo(startTimeRef.current, true)
      playerRef.current.playVideo()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, isPlayerReady])

  const handleSliderChange = useCallback(
    (values: { min: number; max?: number }) => {
      startTimeRef.current = values.min
      endTimeRef.current = values.max ?? duration
      console.log("testing sider", playerRef.current, isPlayerReady)
      if (playerRef.current) {
        if (isPlayerReady) {
          console.log(
            "sliderchange seek",
            startTimeRef.current,
            endTimeRef.current
          )
          playerRef.current.seekTo(startTimeRef.current, true)
        }
      }
    },
    [selectedVideo, isPlayerReady]
  )

  console.log("testing video isplayig", isPlaying, playerRef.current)

  return (
    <div className="video-player relative">
      <div ref={iframeRef} className="w-full h-[315px] lg:h-[450px]">
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
