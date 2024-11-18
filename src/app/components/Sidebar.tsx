"use client";
import React from 'react'
import Image from 'next/image';
import { useSidebar } from '@/context/SidebarContext'


const Sidebar = () => {
    const { currentVideos, currentPage, totalPages, goToNextPage, goToPreviousPage } = useSidebar()

    console.log('Testing current videos', currentVideos)
    return (
        <div className='w-full lg:w-1/4 xl:w-[492px] p-4 border-b lg:border-b-0 lg:border-r border-gray-300'>
            <div className=''>Search</div>
            {currentVideos.map((video) => (
                <div key={video.id.videoId} className='flex'>
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