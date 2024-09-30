"use client";

import searchUsers from "@/actions/(searches)/search_users";
import searchPosts from "@/actions/(searches)/search_posts";
import { ChevronRight, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { timeAgo, TimeAgoConfig } from "@/lib/time";
import { useSession } from "next-auth/react";
import Post from "@/components/ui/post";
import { toast } from "sonner";

const customTimeConfig: TimeAgoConfig = {
    years: ['y', 'y'],
    months: ['m', 'm'],
    days: ['d', 'd'],
    hours: ['h', 'h'],
    minutes: ['m', 'm'],
    seconds: ['s', 's'],
    template: '{value}{unit} ago',
};

export default function SearchSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchMode, setSearchMode] = useState<'users' | 'posts'>('users');
    const [users, setUsers] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [showViewAuthors, setShowViewAuthors] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        const searchResults = async () => {
            if (searchMode === 'users' && debouncedSearchTerm) {
                const users = await searchUsers({ query: debouncedSearchTerm });
                setUsers(users);
            } else if (searchMode === 'posts' && debouncedSearchTerm) {
                const posts = await searchPosts({ query: debouncedSearchTerm });
                setPosts(posts);
            }
        };

        searchResults();
    }, [debouncedSearchTerm, searchMode]);

    const loadMorePosts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            if (!hasMore) return;
            const cursor = posts.length ? posts[posts.length - 1].id : undefined;

            const newPosts = await searchPosts({ query: debouncedSearchTerm, cursor });

            if (newPosts && newPosts.length > 0) {
                setPosts((prevPosts) => {
                    const allPosts = [...prevPosts, ...newPosts];
                    return Array.from(new Set(allPosts.map(post => post.id)))
                        .map(id => allPosts.find(post => post.id === id));
                });

                if (newPosts.length < 10) {
                    console.log('No more posts found');
                    setHasMore(false);
                }

                return;
            }
            else {
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
                    if (hasMore) {
                        loadMorePosts();
                    } else {
                        observer.unobserve(loaderRef.current as Element);
                        console.log('Observer unobserved');
                    }
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
    }, [loaderRef.current, hasMore]);


    const handleSearchClick = () => {
        setSearchMode('posts');
        setShowViewAuthors(true);
    };

    const handleViewAuthorsClick = () => {
        setSearchMode('users');
        setShowViewAuthors(false);
    };

    useEffect(() => {
        if (!searchTerm) {
            setSearchMode('users');
            setUsers([]);
            setPosts([]);
            setShowViewAuthors(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        console.log(hasMore)
    }, [hasMore])

    return (
        <>
            <div className="w-full h-auto p-6">
                <input
                    className="bg-neutral-800 border border-neutral-700 p-2.5 px-6 w-full rounded-xl"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-col w-full space-y-4 px-6">
                {debouncedSearchTerm && !showViewAuthors && (
                    <>
                        <div
                            className="flex w-full relative group h-fit cursor-pointer"
                            onClick={handleSearchClick}
                        >
                            <div className="absolute -inset-x-3 -inset-y-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>

                            <div className="pr-6 z-[2]">
                                <SearchIcon size={24} className='text-neutral-500' />
                            </div>
                            <p className='text-foreground z-[2]'>{debouncedSearchTerm}</p>
                            <div className="pl-5 !ml-auto z-[2]">
                                <ChevronRight className='text-neutral-500' />
                            </div>
                        </div>
                        <hr className="my-4 border-border" />
                    </>
                )}

                {debouncedSearchTerm && showViewAuthors && (
                    <>
                        <div
                            className="flex w-full relative group h-fit cursor-pointer"
                            onClick={handleViewAuthorsClick}
                        >
                            <div className="absolute -inset-x-3 -inset-y-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>

                            <div className="pr-6 z-[2]">
                                <SearchIcon size={24} className='text-neutral-500' />
                            </div>
                            <p className='text-foreground z-[2]'>View Authors</p>
                            <div className="pl-5 !ml-auto z-[2]">
                                <ChevronRight className='text-neutral-500' />
                            </div>
                        </div>
                        <hr className="my-4 border-border" />
                    </>
                )}

                <div className="px-1">
                    {searchMode === 'users' && (
                        <>
                            {debouncedSearchTerm ? (
                                users.length === 0 ? (
                                    <p className="text-neutral-400">No users found</p>
                                ) : (
                                    users.map((user, index) => (
                                        <>
                                            <div key={user.id} className="flex items-center">
                                                <img
                                                    src={user.avatarUrl || '/default-avatar.png'}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full mr-4"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&";
                                                    }}
                                                />
                                                <div>
                                                    <h3 className="text-foreground font-semibold">{user.username}</h3>
                                                    <p className="text-neutral-400">{user.bio}</p>
                                                </div>
                                            </div>
                                            {index < users?.length - 1 && <hr className="my-4 border-border" />}
                                        </>
                                    ))
                                )
                            ) : (
                                <p className="text-neutral-400">No results found</p>
                            )}
                        </>
                    )}

                    {searchMode === 'posts' && (
                        <>
                            <div className="space-y-4 divide-y divide-border">
                                {posts.map((post: any, index) => {
                                    const images = post.imageUrl && JSON.parse(post.imageUrl) !== null ? JSON.parse(post.imageUrl) : null;

                                    const hasLiked = Array.isArray(post.likes) && post.likes.some((like: { user: { id: string; }; }) => {
                                        return like.user.id === session?.user?.id;
                                    });

                                    return <Post
                                        key={index}
                                        post_id={post.id}
                                        username={post.author.username}
                                        avatarUrl={post.author.avatarUrl || '/placeholder.svg?height=300&width=500'}
                                        likes={post.likes.length}
                                        comments={post.replies.length}
                                        timeAgo={timeAgo(post.createdAt as Date, customTimeConfig)}
                                        replies={post.replies?.map((reply: { id: React.Key | null | undefined; author: { username: any; avatarUrl: any } }) => ({
                                            id: reply.id,
                                            author: {
                                                username: reply.author.username,
                                                avatarUrl: reply.author.avatarUrl || '/placeholder.svg?height=40&width=40',
                                            },
                                        }))}
                                        isLiked={!!hasLiked}
                                        content={post.content}
                                        session_id={session?.user?.id || ''}
                                        images={images}
                                    />
                                })}
                            </div>

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
                    )}
                </div>
            </div>
        </>
    );
}
