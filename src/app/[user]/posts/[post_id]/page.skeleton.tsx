"use client";

import { motion } from 'framer-motion';
import { Home, Search, Globe, Video, MessageCircle, Bell, Heart, Bookmark, Send, ArrowLeft, MoreVertical } from 'lucide-react'

export default function PostIdSkeleton() {
    return (
        <motion.div className="flex flex-col md:flex-row w-full max-w-7xl h-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="w-full md:w-[600px] h-full mb-4 md:mb-0">
                <div className="w-full h-full animate-pulse bg-skeleton rounded-3xl"></div>
            </div>

            <div className="w-full md:w-[400px] flex flex-col md:ml-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 animate-pulse bg-skeleton rounded-full"></div>

                        <div className='space-y-1'>
                            <div className="w-20 h-4 animate-pulse bg-skeleton rounded"></div>
                            <div className="w-16 h-3 animate-pulse bg-skeleton rounded"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-6 animate-pulse bg-skeleton rounded-full"></div>
                        <div className="w-8 h-3 animate-pulse bg-skeleton rounded"></div>
                    </div>
                </div>

                <div className="w-full h-4 animate-pulse bg-skeleton rounded"></div>

                <div className="space-y-4 mb-6 mt-6 flex-grow overflow-y-auto">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 animate-pulse bg-skeleton rounded-full "></div>
                        <div className='space-y-1'>
                            <div className="w-24 h-3 animate-pulse bg-skeleton rounded"></div>
                            <div className="w-12 h-2 animate-pulse bg-skeleton rounded"></div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 animate-pulse bg-skeleton rounded-full"></div>
                        <div className='space-y-1'>
                            <div className="w-24 h-3 animate-pulse bg-skeleton rounded"></div>
                            <div className="w-12 h-2 animate-pulse bg-skeleton rounded"></div>
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-between items-center mb-6">
                    <div className="w-6 h-6 animate-pulse bg-skeleton rounded-full"></div>
                    <div className="w-6 h-6 animate-pulse bg-skeleton rounded-full"></div>
                </div>

                <hr className="mb-6 border-gray-200 animate-pulse" />

                <div className="flex items-center space-x-2 mb-6">
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 animate-pulse bg-skeleton rounded-full"></div>
                        <div className="w-6 h-6 animate-pulse bg-skeleton rounded-full"></div>
                        <div className="w-6 h-6 animate-pulse bg-skeleton rounded-full"></div>
                    </div>

                    <div className="w-40 h-3 animate-pulse bg-skeleton rounded"></div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="w-10 h-8 animate-pulse bg-skeleton rounded-full"></div>
                    <div className="w-full h-8 animate-pulse bg-skeleton rounded-full"></div>
                    <div className="size-4 animate-pulse bg-skeleton rounded-full"></div>
                </div>
            </div>
        </motion.div >
    )
}