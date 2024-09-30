"use client";

import getPosts from "@/actions/(posts)/get_posts.action";
import { timeAgo } from "@/lib/time";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

interface Post {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    replies: {
        id: string;
        content: string;
        createdAt: Date;
        author: {
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    }[];
    likes: {
        id: string;
    }[];
    bookmarks: {
        id: string;
    }[];
}

export default function ProfilePictures({ customTimeConfig, session_id }: { customTimeConfig: any; session_id?: string; }) {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        async function fetchPosts() {
            const fetchPosts = await getPosts({ limit: 10, userId: session_id });
            setPosts(fetchPosts);
        }

        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-24 p-6">
            {posts === null ? (
                <div className="flex flex-col w-full h-full space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
                        <div className="flex flex-col w-full space-y-2">
                            <div className="w-1/2 h-4 bg-neutral-700 rounded"></div>
                            <div className="w-1/4 h-4 bg-neutral-700 rounded"></div>
                        </div>
                    </div>
                </div>
            ) : (
                posts.length === 0 ? (
                    <div className="flex items-center justify-center w-full border border-neutral-700 rounded-xl border-dotted h-24">
                        <p className="text-foreground">No posts</p>
                    </div>
                ) : (
                    posts.map((post: any, index: number) => (
                        <React.Fragment key={index}>
                            <Link href={`/@${post.author.username}/posts/${post.id}`} className="relative group">
                                <div className="absolute -inset-x-3 -inset-y-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>

                                <div className="flex flex-col w-full space-y-4">
                                    <div className="flex items-center space-x-2 z-[2] !mt-0">
                                        <img src={post.author.avatarUrl || '/placeholder.svg?height=40&width=40'} alt="User" className="w-12 h-12 rounded-full"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&";
                                            }} />
                                        <div className="flex flex-col w-full">
                                            <div className="flex items-center w-full space-x-2">
                                                <h1 className="text-md font-bold">{post.author.username}</h1>
                                                <p className="text-sm text-zinc-400">{timeAgo(post.createdAt, customTimeConfig)}</p>
                                                <div className="relative group/ellipsis !ml-auto !mr-2">
                                                    <EllipsisIcon className="w-4 h-4 text-gray-400" />
                                                    <div className="absolute h-4 w-4 p-4 -inset-x-2 -inset-y-2 z-0 scale-90 opacity-0 transition group-hover/ellipsis:scale-100 group-hover/ellipsis:opacity-100 sm:rounded-2xl bg-zinc-700/50"></div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-400">{post.content}</p>
                                        </div>
                                    </div>

                                    {(() => {
                                        const images = post.imageUrl && JSON.parse(post.imageUrl) !== null ? JSON.parse(post.imageUrl) : null;

                                        const nextImage = () => {
                                            setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                        }

                                        const prevImage = () => {
                                            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                                        }

                                        return (
                                            <>
                                                {images && images.length > 0 && (
                                                    <div className='relative group'>
                                                        <div className="relative w-full h-auto object-cover rounded-xl z-[2]">
                                                            {/* Single image */}
                                                            {images.length === 1 ? (
                                                                <img src={images[0]} alt="Post image" className="w-auto h-max max-h-96 rounded-xl" />
                                                            ) : (
                                                                <>
                                                                    {/* Carousel image */}
                                                                    <img
                                                                        src={images[currentImageIndex]}
                                                                        alt={`Post image ${currentImageIndex + 1}`}
                                                                        className="w-full h-auto object-cover rounded-xl"
                                                                    />
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
                                                    </div>
                                                )}
                                            </>
                                        )
                                    })()}
                                </div>

                            </Link>
                            {index < posts?.length - 1 && <hr className="my-4 border-border" />}
                        </React.Fragment>
                    ))
                )
            )}
        </div>
    )
}