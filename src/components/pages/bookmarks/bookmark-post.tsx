"use client";

import { EllipsisIcon } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react';

interface PostProps {
    post_id: string;
    username: string;
    avatarUrl: string;
    timeAgo: string;
    content: string;
    images?: string[];
}

export default function BookmarkPost({ post_id, username, avatarUrl, timeAgo, content, images }: PostProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const icons = {
        like: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    }

    const nextImage = () => {
        if (images && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (images && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    return (
        <Link className="flex p-4 relative group" href={`/[username]/posts/[id]`} as={`/@${username}/posts/${post_id}`}>
            <div className="absolute -inset-x-1 -inset-y-1 scale-90 mx-2 my-1 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>

            <div className='flex flex-col items-center space-y-2.5 z-[2]'>
                <img
                    src={avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"}
                    alt="User"
                    className="size-10 rounded-full"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&";
                    }}
                />
            </div>
            <div className="flex-grow pl-4 z-[2]">
                <div className="flex justify-between items-center space-x-3 mb-1">
                    <p className="font-semibold">{username}</p>
                    <div className='flex space-x-2'>
                        <p className="text-xs text-gray-400">{timeAgo}</p>
                        <div className="relative group/more">
                            <EllipsisIcon className="w-4 h-4 text-gray-400" />
                            <div className="absolute h-4 w-4 p-4 -inset-x-2 -inset-y-2 z-0 scale-90 opacity-0 transition group-hover/more:scale-100 group-hover/more:opacity-100 sm:rounded-2xl bg-zinc-700/50"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-foreground">{content}</p>
                    {images && images.length > 0 && (
                        <div className="relative w-full h-64 object-cover rounded-xl mb-2 z-[2]">
                            {/* Single image */}
                            {images.length === 1 ? (
                                <Link href={`/[username]/posts/[id]`} as={`/${username}/posts/${post_id}`}>
                                    <img src={images[0]} alt="Post image" className="w-full h-64 object-cover rounded-xl outline outline-1 outline-neutral-700" />
                                </Link>
                            ) : (
                                <>
                                    {/* Carousel image */}
                                    <Link href={`/[username]/posts/[id]`} as={`/${username}/posts/${post_id}`}>
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={`Post image ${currentImageIndex + 1}`}
                                            className="w-full h-64 object-cover rounded-xl outline outline-1 outline-neutral-700"
                                        />
                                    </Link>
                                    {/* Left arrow */}
                                    <button
                                        onClick={prevImage}
                                        className={`absolute top-1/2 left-2 p-2 bg-black bg-opacity-50 rounded-full transform -translate-y-1/2 ${currentImageIndex === 0 ? 'hidden' : ''}`}
                                    >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-foreground">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    {/* Right arrow */}
                                    <button
                                        onClick={nextImage}
                                        className={`absolute top-1/2 right-2 p-2 bg-black bg-opacity-50 rounded-full transform -translate-y-1/2 ${currentImageIndex === images.length - 1 ? 'hidden' : ''}`}
                                    >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-foreground">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}