"use client";

import toggleLikeOnPost from '@/actions/(posts)/like_post.action';
import { EllipsisIcon } from 'lucide-react'
import Link from 'next/link';
import React, { startTransition, useOptimistic, useState } from 'react'
import { toast } from 'sonner';
import CustomPopover from './menu-popover';
import { deletePost } from '@/actions/(posts)/delete_post.action';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PostProps {
    post_id: string;
    username: string;
    avatarUrl: string;
    likes: number;
    comments: number;
    timeAgo: string;
    isLiked: boolean;
    replies: {
        id: string;
        author: {
            username: string;
            avatarUrl: string;
        };
    }[];
    content: string;
    session_id: string;
    images?: string[];
}

export default function Post({ post_id, username, avatarUrl, likes, comments, timeAgo, replies, isLiked, content, session_id, images }: PostProps) {
    const [likeState, setLikeState] = useState({
        isLiked: isLiked,
        likedCount: likes,
    });
    const { data: session } = useSession();

    const router = useRouter();

    const [optimisticState, updateOptimistic] = useOptimistic(likeState);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const icons = {
        like: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    }

    const deletePostFunction = async () => {
        if (session_id === "") {
            toast.error("You must be logged in to do this.");
        }

        if (post_id && session_id && session_id !== "") {
            deletePost({
                postId: post_id
            }).then((res) => {
                if (res.error) {
                    toast.error(res.error);
                } else {
                    toast.success(res.success);

                    router.refresh();
                }
            });
        }
    }

    const toggleLike = async () => {
        if (session_id === "") {
            toast.error("You must be logged in to do this.");
        }

        const newIsLiked = !optimisticState.isLiked;
        const newLikedCount = newIsLiked ? optimisticState.likedCount + 1 : optimisticState.likedCount - 1;

        const optimisticValue = {
            isLiked: newIsLiked,
            likedCount: newLikedCount,
            pending: true,
        };

        startTransition(() => {
            updateOptimistic(optimisticValue);
        });

        if (post_id && session_id && session_id !== "") {
            toggleLikeOnPost({
                userId: session_id,
                postId: post_id
            }).then((res) => {
                const realValue = {
                    isLiked: res.liked,
                    likedCount: res.liked ? likeState.likedCount + 1 : likeState.likedCount - 1,
                };

                setLikeState(realValue as any);
            });
        }
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
        <div className="flex p-4">
            <div className='flex flex-col items-center space-y-2.5'>
                <Link href={`/@[username]`} as={`/@${username}`}>
                    <img
                        src={avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"}
                        alt="User"
                        className="size-10 rounded-full"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&";
                        }}
                    />
                </Link>
                <div className='w-0.5 min-h-2 h-full bg-border'></div>
                <div className='flex items-center space-x-1 relative h-8'>
                    <ReplyAvatars replies={replies} />
                </div>
            </div>
            <div className="flex-grow pl-4">
                <div className="flex justify-between items-center space-x-3 mb-1">
                    <Link href={`/@[username]`} as={`/@${username}`}>
                        <p className="font-semibold">{username}</p>
                    </Link>
                    <div className='flex space-x-2'>
                        <p className="text-xs text-gray-400">{timeAgo}</p>
                        <CustomPopover
                            placement='bottom-left'
                            offset={0}
                            className='bg-card rounded-2xl z-[10] border border-border shadow-2xl'
                            trigger={
                                <div className="relative group cursor-pointer">
                                    <EllipsisIcon className="w-4 h-4 text-gray-400" />
                                    <div className="absolute h-4 w-4 p-4 -inset-x-2 -inset-y-2 z-0 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:rounded-2xl bg-zinc-700/50"></div>
                                </div>
                            }>
                            <div className="flex flex-col min-w-[12rem]">
                                <div className="flex flex-col space-y-0.5 p-1">
                                    <Link href={`/@${username}/posts/${post_id}`} className='px-4 py-3 transition-colors hover:bg-skeleton/50 rounded-xl'>View post</Link>
                                </div>

                                <hr className="border-border w-full" />

                                <div className="flex flex-col p-1 space-y-0.5">
                                    {username === session?.user.username ? (
                                        <button className='px-4 py-3 transition-colors hover:bg-skeleton/50 rounded-xl text-left' onClick={deletePostFunction}>Delete post</button>
                                    ) : (
                                        <button className='px-4 py-3 transition-colors hover:bg-skeleton/50 rounded-xl text-left'>Report</button>
                                    )}
                                </div>
                            </div>
                        </CustomPopover>
                    </div>
                </div>
                <div className='relative group'>
                    <div className="absolute -inset-x-3 -inset-y-2 scale-90 mx-1 mt-1.5 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                    <Link href={`/[username]/posts/[id]`} as={`/${username}/posts/${post_id}`} className='relative z-[2]'>
                        <p className="text-foreground min-h-[2.6rem]">{content}</p>
                    </Link>
                    {images && images.length > 0 && (
                        <div className="relative w-full h-64 object-cover rounded-xl mb-2 z-[2]">
                            {images.length === 1 ? (
                                <Link href={`/[username]/posts/[id]`} as={`/${username}/posts/${post_id}`}>
                                    <img src={images[0]} alt="Post image" className="w-full h-64 object-cover rounded-xl outline outline-1 outline-neutral-700" />
                                </Link>
                            ) : (
                                <>
                                    <Link href={`/[username]/posts/[id]`} as={`/${username}/posts/${post_id}`}>
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={`Post image ${currentImageIndex + 1}`}
                                            className="w-full h-64 object-cover rounded-xl outline outline-1 outline-neutral-700"
                                        />
                                    </Link>

                                    <button
                                        onClick={prevImage}
                                        className={`absolute top-1/2 left-2 p-2 bg-black bg-opacity-50 rounded-full transform -translate-y-1/2 ${currentImageIndex === 0 ? 'hidden' : ''}`}
                                    >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-foreground">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

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
                <div className="flex items-center space-x-4 text-gray-400 flex-grow mt-2">
                    <button className={`flex items-center space-x-1 group relative ${(optimisticState.isLiked) ? 'text-red-500' : 'text-gray-400'}  ${(optimisticState as any).pending ? 'animate-pulse' : ''}`} onClick={toggleLike}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`w-5 h-5 z-[2] ${optimisticState.isLiked ? 'fill-red-500' : ''}`} xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons["like"]} />
                        </svg>
                        <span className='z-[2]'>{optimisticState.likedCount}</span>
                        <div className="absolute -inset-x-3 -inset-y-1 w-12 h-8 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                    </button>
                    <Link className={`flex items-center space-x-1 text-gray-400 relative group`} href={`/[username]/posts/[id]`} as={`/${username}/posts/${post_id}`}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`z-[2] w-5 h-5`} xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons["comment"]} />
                        </svg>
                        <span className='z-[2]'>{comments}</span>
                        <div className="absolute -inset-x-3 -inset-y-1 w-12 h-8 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

interface ReplyAvatarsProps {
    replies: {
        id: string;
        author: {
            username: string;
            avatarUrl: string;
        };
    }[];
}

function ReplyAvatars({ replies }: ReplyAvatarsProps) {
    const displayedReplies = replies.slice(0, 3);

    return (
        <div className="flex items-center -space-x-3">
            {displayedReplies.map((reply, index) => (
                <img
                    key={reply.id}
                    src={reply.author.avatarUrl}
                    alt={reply.author.username}
                    className="w-5 h-5 rounded-full border-2 border-border overflow-hidden"
                    style={{ zIndex: 3 - index }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40";
                    }}
                />
            ))}

            {replies.length <= 0 && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-zinc-700">
                    <span className='text-xs text-zinc-600'>?</span>
                </div>
            )}
        </div>
    );
}
