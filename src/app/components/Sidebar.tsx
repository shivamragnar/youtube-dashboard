"use client";
import { useSidebar } from '@/context/SidebarContext'
import React from 'react'


const Sidebar = () => {
    const { currentVideos, currentPage, totalPages, goToNextPage, goToPreviousPage } = useSidebar()

    console.log('Testing current videos', currentVideos)
    return (
        <div className='w-full lg:w-1/4 xl:w-[492px] p-4 border-b lg:border-b-0 lg:border-r border-gray-300'>
            Sidebar

            <div className='flex'>
                <button onClick={goToPreviousPage}>{'<'}</button>
                <span>{currentPage}/{totalPages}</span>
                <button onClick={goToNextPage}>{'>'}</button>
            </div>
        </div>
    )
}

export default Sidebar