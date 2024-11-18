"use client";
import React, { useCallback, useState } from 'react'
import Image from 'next/image';
import { useSidebar } from '@/context/SidebarContext'

const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

const Sidebar = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { currentVideos, currentPage, totalPages, selectedVideo, setSelectedVideo, goToNextPage, goToPreviousPage, setSearchQuery: updateSearchQuery } = useSidebar()

    const debouncedSearch = useCallback(debounce((value: string) => updateSearchQuery(value), 300), []);

    const handleSelectVideo = (id: string) => {
        console.log('click')
        setSelectedVideo(id)
    }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }

    return (
        <div className='w-full lg:w-1/4 xl:w-[492px] p-4 border-b lg:border-b-0 lg:border-r border-gray-300'>
            <div className=''>
            <input
                type='text'
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder='Search by title or description...'
                className='w-full p-2 mb-4 border rounded'
            />
            </div>
            {currentVideos.map((video) => (
                <div key={video.id.videoId} className={`flex cursor-pointer ${selectedVideo === video.id.videoId ? 'border-gray-300' : ''}`} onClick={() => handleSelectVideo(video.id.videoId)}>
                    <div className="relative w-40 h-24 flex-shrink-0">
                        <Image
                            src={video.snippet.thumbnails.high.url}
                            alt={video.snippet.title}
                            fill
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div className="ml-3 flex flex-col justify-between">
                        <h3 className="text-sm font-semibold text-white mb-1 leading-tight">
                            {video.snippet.title}
                        </h3>
                        <div className="text-xs text-gray-400">
                            <p>{video.snippet.channelTitle}</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className='flex'>
                <button onClick={goToPreviousPage}>{'<'}</button>
                <span>{currentPage}/{totalPages}</span>
                <button onClick={goToNextPage}>{'>'}</button>
            </div>
        </div>
    )
}

export default Sidebar