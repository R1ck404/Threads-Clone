"use client";

import Image from 'next/image'
import { Heart, Bookmark, Send, ArrowLeft, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import getPost from '@/actions/(posts)/get_post.action';
import PostIdSkeleton from './page.skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { Post } from '@prisma/client';
import { timeAgo, TimeAgoConfig } from '@/lib/time';
import toggleLikeOnPost from '@/actions/(posts)/like_post.action';
import toggleBookmarkOnPost from '@/actions/(posts)/bookmark_post.action';
import commentOnPost from '@/actions/(posts)/comment_on_post.action';
import Sidebar from '@/components/ui/sidebar';
import SuggestedUsers from '@/components/pages/suggested_users/suggested_users';
import { toast } from 'sonner';

const customTimeConfig: TimeAgoConfig = {
    years: ['y', 'y'],
    months: ['m', 'm'],
    days: ['d', 'd'],
    hours: ['h', 'h'],
    minutes: ['m', 'm'],
    seconds: ['s', 's'],
    template: '{value}{unit} ago',
};

export default function Component({ params }: { params: { [anyProp: string]: string } }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasBookmarked, setHasBookmarked] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [post, setPost] = useState<null | Post>(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    const nextImage = (images: string | any[]) => {
        if (images && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = (images: any) => {
        if (images && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const addComment = async () => {
        if (!session) {
            toast.error("You must be logged in to comment on a post");
            return;
        }

        if (post && session?.user?.id) {
            const inputVal = inputRef.current?.value || '';

            if (inputVal === '') {
                return;
            }

            commentOnPost({
                postId: post.id,
                userId: session.user.id,
                content: inputVal
            }).then((newReply) => {
                const completeReply = newReply;
                (completeReply as any).author = session.user;

                inputRef.current!.value = '';

                setPost({
                    ...post,
                    replies: [...(post as any).replies, completeReply]
                } as Post);
            });
        }
    }

    const toggleLike = async () => {
        if (!session) {
            toast.error("You must be logged in to like a post");
            return;
        }

        if (post && session?.user?.id) {
            toggleLikeOnPost({
                userId: session.user.id,
                postId: post.id
            }).then((res) => {
                console.log(res);

                setHasLiked(res.liked ?? false);
            });
        } else {
            console.log("User is not logged in");
        }
    }

    const toggleBookmark = async () => {
        if (!session) {
            toast.error("You must be logged in to bookmark a post");
            return;
        }

        if (post && session?.user?.id) {
            toggleBookmarkOnPost({
                userId: session.user.id,
                postId: post.id
            }).then((res) => {
                console.log(res);

                setHasBookmarked(res.bookmarked ?? false);
            });
        }
    }

    useEffect(() => {
        getPost({
            id: params.post_id
        }).then((newPost) => {
            setPost(newPost as unknown as Post);
        });
    }, []);

    useEffect(() => {
        if (post && session?.user?.id) {
            const hasLiked = (post as any).likes.some((like: { user: { id: string; }; }) => like.user.id === session.user.id)
            setHasLiked(hasLiked);

            const hasBookmarked = (post as any).bookmarks.some((bookmark: { user: { id: string; }; }) => bookmark.user.id === session.user.id)
            setHasBookmarked(hasBookmarked);
        }
    }, [post, session]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background sm:pb-0 pb-20">
            <Sidebar status={status} />

            {post == null && (
                <main className="flex-1 flex justify-center items-start py-4 md:py-8 px-4">
                    <PostIdSkeleton />
                </main>
            )}

            <AnimatePresence
                mode='wait'
            >
                {post !== null && (() => {
                    const hasImages = post.imageUrl && JSON.parse(post.imageUrl) !== null;
                    return <main className={`flex-1 flex items-start ${hasImages ? "justify-center py-4 md:py-8 px-4" : "justify-between"}`}>
                        <motion.div className={`flex flex-col md:flex-row w-full h-full ${hasImages ? "max-w-7xl" : "max-w-full justify-between"}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            layout
                        >
                            {(() => {
                                const parsedImages = post.imageUrl && JSON.parse(post.imageUrl) !== null ? JSON.parse(post.imageUrl) : null;
                                if (!parsedImages) {
                                    return;
                                }

                                if (parsedImages && parsedImages.length <= 0) {
                                    return;
                                }

                                if (parsedImages && parsedImages.length > 1) {
                                    return (
                                        <div className="relative w-full md:w-[600px] h-full mb-4 md:mb-0">
                                            <div className='absolute top-1 left-1'>
                                                <button className="p-2 bg-skeleton bg-opacity-50 rounded-full hover:bg-opacity-100 transition-colors" onClick={() => {
                                                    router.back();
                                                }}>
                                                    <ArrowLeft className="w-6 h-6 text-foreground" />
                                                </button>
                                            </div>
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={parsedImages[currentImageIndex]}
                                                    alt="Post image"
                                                    width={600}
                                                    height={600}
                                                    className="rounded-3xl h-full w-full object-cover"
                                                />

                                                <button className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-skeleton bg-opacity-50 rounded-full hover:bg-opacity-100 transition-colors" onClick={() => {
                                                    console.log("Previous image");
                                                    prevImage(parsedImages);
                                                }}>
                                                    <ArrowLeft className="w-6 h-6 text-foreground" />
                                                </button>
                                                <button className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-skeleton bg-opacity-50 rounded-full hover:bg-opacity-100 transition-colors" onClick={() => {
                                                    console.log("Next image");
                                                    nextImage(parsedImages);
                                                }}>
                                                    <ArrowRight className="w-6 h-6 text-foreground" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="relative w-full md:w-[600px] h-full mb-4 md:mb-0">
                                            <div className='absolute top-1 left-1'>
                                                <button className="p-2 bg-skeleton bg-opacity-50 rounded-full hover:bg-opacity-100 transition-colors" onClick={() => {
                                                    router.back();
                                                }}>
                                                    <ArrowLeft className="w-6 h-6 text-foreground" />
                                                </button>
                                            </div>
                                            <Image
                                                src={parsedImages[0]}
                                                alt="Post image"
                                                width={600}
                                                height={600}
                                                className="rounded-3xl h-full w-full object-cover"
                                            />
                                        </div>
                                    );
                                }
                            })()}

                            <div className={`w-full md:w-[400px] flex flex-col ${hasImages ? "md:ml-auto" : "mx-auto min-w-[30rem] m-4 rounded-2xl border border-border bg-card p-4"}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src="/placeholder.svg"
                                            alt="Profile picture"
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <h2 className="font-semibold text-sm text-foreground">
                                                {(post as any).author.username}
                                            </h2>
                                            <p className="text-xs text-gray-500">
                                                {(post as any).author.bio}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Following</span>
                                        <span className="text-xs text-gray-500">
                                            {timeAgo(post.createdAt, customTimeConfig)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-foreground">
                                    {(post as any).content}
                                </p>

                                <hr className="my-6 border-border" />

                                <div className="space-y-4 mb-6 flex-grow overflow-y-auto w-full">
                                    {(post as any).replies.map((reply: { author: { username: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }; createdAt: string | Date; content: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: Key | null | undefined) => (
                                        <div key={index} className="flex items-start space-x-3 w-full group">
                                            <Image
                                                src="/placeholder.svg"
                                                alt="Commenter"
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <div className='flex flex-col w-full '>
                                                <div className="flex justify-between text-sm w-full items-center">
                                                    <span className="font-semibold text-foreground">
                                                        {reply.author.username}
                                                    </span>
                                                    <motion.div className='flex items-center space-x-1' layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <span className="text-xs text-gray-500">
                                                            {timeAgo(reply.createdAt, customTimeConfig)}
                                                        </span>
                                                    </motion.div>
                                                </div>
                                                <span className='text-sm text-gray-500 text-nowrap'>{reply.content}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex w-full justify-between items-center mb-4">
                                    <button className="flex items-center justify-center p-2 hover:bg-skeleton rounded-full" onClick={() => {
                                        toggleLike();
                                    }}>
                                        <Heart className={`w-6 h-6 ${hasLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                                    </button>
                                    <button className="flex items-center justify-center p-2 hover:bg-skeleton rounded-full" onClick={() => {
                                        toggleBookmark();
                                    }}>
                                        <Bookmark className={`w-6 h-6 ${hasBookmarked ? 'text-blue-500 fill-blue-500' : 'text-gray-500'}`} />
                                    </button>
                                </div>

                                <hr className="mb-6 border-border" />

                                {(hasLiked ?? (post as any).likes.length > 0) && (
                                    <div className="flex items-center space-x-2 mb-6">
                                        <div className="flex -space-x-2">
                                            <Image src="/placeholder.svg" alt="Liker" width={24} height={24} className="rounded-full border-2 border-border" />
                                            <Image src="/placeholder.svg" alt="Liker" width={24} height={24} className="rounded-full border-2 border-border" />
                                            <Image src="/placeholder.svg" alt="Liker" width={24} height={24} className="rounded-full border-2 border-border" />
                                        </div>
                                        <p className="text-sm text-gray-600">Liked by {(post as any).likes.length} other{(post as any).likes.length > 1 ? "s" : ""}</p>
                                    </div>
                                )}

                                {/* Comment Input */}
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={session?.user.avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"}
                                        alt="Your profile"
                                        width={32}
                                        height={32}
                                        className="rounded-full size-8"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&";
                                        }}
                                    />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Add comment..."
                                        className="flex-1 bg-skeleton rounded-full py-2 px-4 text-sm focus:outline-none disabled:bg-card text-foreground transition-colors"
                                        disabled={!session}
                                    />
                                    <button className="flex items-center justify-center p-2 hover:bg-skeleton rounded-full" onClick={() => {
                                        addComment();
                                    }}>
                                        <Send className={`w-5 h-5 text-gray-400 ${!session ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
                                    </button>
                                </div>
                            </div>

                            {!hasImages && (
                                <SuggestedUsers userId={session?.user.id ?? ''} />
                            )}
                        </motion.div>
                    </main>
                })()}
            </AnimatePresence>
        </div>
    )
}