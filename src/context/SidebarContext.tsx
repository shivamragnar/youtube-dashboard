"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react"

type VideoItem = {
  id: {
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelTitle: string
    title: string
    description: string
    thumbnails: {
      high: {
        url: string
      }
    }
  }
}

type SidebarContextType = {
  currentPage: number
  pageSize: number
  totalPages: number
  currentVideos: VideoItem[]
  selectedVideo: string | null
  setSelectedVideo: (id: string) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const pageSize = 10

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/data.json")
        const data = await response.json()
        console.log("testing data", data)
        setVideos(data.items)
      } catch (error) {
        console.log("Failed to fetch", error)
      }
    }
    fetchVideos()
  }, [])

  const totalPages = Math.ceil(videos.length / pageSize)

  const currentVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return videos.slice(startIndex, endIndex)
  }, [currentPage, videos])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <SidebarContext.Provider
      value={{
        currentPage,
        pageSize,
        totalPages,
        currentVideos,
        selectedVideo,
        setSelectedVideo,
        goToNextPage,
        goToPreviousPage,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar should be within a SidebarProvider")
  }
  return context
}
