"use client";

import { useState, useEffect, useRef } from 'react';
import Post from '@/components/ui/post';
import { timeAgo, TimeAgoConfig } from '@/lib/time';
import { toast } from 'sonner';
import getPosts from '@/actions/(posts)/get_posts.action';

const customTimeConfig: TimeAgoConfig = {
    years: ['y', 'y'],
    months: ['m', 'm'],
    days: ['d', 'd'],
    hours: ['h', 'h'],
    minutes: ['m', 'm'],
    seconds: ['s', 's'],
    template: '{value}{unit} ago',
};

export default function PostsFeed({ initialPosts, session }: { initialPosts: any[], session: any }) {
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const loadMorePosts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            if (!hasMore) return;

            const cursor = posts.length ? posts[posts.length - 1].id : undefined;

            const newPosts = await getPosts({ cursor });

            if (newPosts && newPosts.length > 0) {
                setPosts((prevPosts) => [...prevPosts, ...newPosts]);

                if (newPosts.length < 10) {
                    setHasMore(false);
                }

                return;
            } else {
                setHasMore(false);
            }
        } catch (error) {
            toast.error('Failed to load more posts.');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMorePosts();
                }
            },
            { threshold: 1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loaderRef.current]);

    return (
        <>
            {posts.map((post: any) => {
                const hasLiked = Array.isArray(post.likes) && post.likes.some((like: { user: { id: string; }; }) => like.user.id === session?.user?.id);

                const images = post.imageUrl && JSON.parse(post.imageUrl) !== null ? JSON.parse(post.imageUrl) : null;

                return (
                    <Post
                        key={post.id}
                        post_id={post.id}
                        username={post.author.username}
                        avatarUrl={post.author.avatarUrl || '/placeholder-image.jpg?height=40&width=40'}
                        likes={post.likes.length}
                        comments={post.replies.length}
                        timeAgo={timeAgo(post.createdAt as Date, customTimeConfig)}
                        replies={post.replies?.map((reply: { id: React.Key | null | undefined; author: { username: any; avatarUrl: any } }) => ({
                            id: reply.id,
                            author: {
                                username: reply.author.username,
                                avatarUrl: reply.author.avatarUrl || '/placeholder-image.jpg?height=40&width=40',
                            },
                        }))}
                        isLiked={!!hasLiked}
                        content={post.content}
                        session_id={session?.user?.id || ''}
                        images={images}
                    />
                );
            })}

            {loading && (
                <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-border"></div>
                </div>
            )}

            <div ref={loaderRef} className="h-12 flex justify-center items-center">
                {hasMore ? (
                    !loading && <span className="text-neutral-400">Loading more posts...</span>
                ) : (
                    <span className="text-neutral-400">No more posts to show.</span>
                )}
            </div>
        </>
    );
}
