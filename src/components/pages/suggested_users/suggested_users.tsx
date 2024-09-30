"use client";

import React, { useEffect, useState } from 'react';
import { followUser, unfollowUser } from '@/actions/(users)/follow.action';
import { getSuggestedUsers } from '@/actions/(users)/get_followers.action';
import SuggestedUsersSkeleton from './suggested_users.skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { formatNumber } from '@/lib/number';
import Link from 'next/link';
import { MouseEvent } from 'react';

type User = {
    id: string;
    username: string;
    avatarUrl?: string;
    followsYou?: boolean;
    youFollow?: boolean;
};

type SuggestedUsersProps = {
    userId: string;
};

export default function SuggestedUsers({ userId }: SuggestedUsersProps) {
    const { data: session, status } = useSession();
    const [suggestedUsers, setSuggestedUsers] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            const users = await getSuggestedUsers({ userId });
            setSuggestedUsers((users as any));
        };
        fetchSuggestedUsers();
    }, [userId]);

    const handleFollowToggle = async (e: MouseEvent<HTMLElement>, user: User) => {
        e.stopPropagation();
        e.preventDefault();

        if (suggestedUsers === null) return;

        if (user.youFollow) {
            await unfollowUser({ followerId: userId, followedId: user.id });
            setSuggestedUsers(prevUsers =>
                prevUsers!.map(u =>
                    u.id === user.id ? { ...u, youFollow: false } : u
                )
            );
        } else {
            await followUser({ followerId: userId, followedId: user.id });
            setSuggestedUsers(prevUsers =>
                prevUsers!.map(u =>
                    u.id === user.id ? { ...u, youFollow: true } : u
                )
            );
        }
    };

    const getSuggestionText = (user: User) => {
        if (user.followsYou && !user.youFollow) {
            return "Follows you";
        }
        return "Suggested for you";
    };

    return (
        <div className={`hidden lg:block w-72 relative text-foreground ${session ? "border-l border-border" : ''}`}>
            <div className={`flex items-end justify-end fixed top-0 p-4 w-full max-w-72  ${status === "unauthenticated" ? "visible" : 'invisible'}`}>
                <Link className="h-fit px-4 py-1.5 rounded-xl bg-white text-black" href={"/login"}>Sign in</Link>
            </div>

            <div className={`fixed top-0 p-4 w-full max-w-72  ${session ? "visible" : 'invisible'}`}>
                <AnimatePresence
                    mode='wait'
                >
                    {suggestedUsers === null ? (
                        <SuggestedUsersSkeleton />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            layout
                        >
                            <div className="flex items-center space-x-2 w-full">
                                <img src={session?.user.avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"} alt="User" className="size-10 rounded-full"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = '/placeholder-image.jpg?height=40&width=40&text=user';
                                    }}
                                />
                                <div className="flex flex-col h-min">
                                    <p className="font-semibold text-md leading-4">{session && session.user.username}</p>
                                    <p className="text-zinc-500 text-sm">
                                        {session && formatNumber(session.user.followersCount)} followers
                                    </p>
                                </div>
                                <button className="text-blue-500 !ml-auto">Switch</button>
                            </div>
                            <div className="flex justify-between w-full my-4">
                                <h2 className="text-sm font-normal text-zinc-400">Suggested for you</h2>
                                <button className="text-foreground text-xs">See all</button>
                            </div>
                            <div className="space-y-4">
                                {status === "authenticated" && suggestedUsers!.map((user, index) => (
                                    <Link key={index} className="flex items-center space-x-2 group relative" href={`/@${user.username}`}>
                                        <div className="absolute -inset-x-3 -inset-y-2 scale-90 mr-1.5 ml-3 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>

                                        <img src={user.avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"} alt={user.username} className="size-8 rounded-full overflow-hidden z-[2]"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder-image.jpg?height=40&width=40&text=user";
                                            }}
                                        />
                                        <div className="flex flex-col h-min z-[2]">
                                            <p className="font-semibold text-sm leading-4">{user.username}</p>
                                            <p className="text-zinc-500 text-xs">
                                                {getSuggestionText(user)}
                                            </p>
                                        </div>
                                        <button
                                            className='rounded-lg border-border border text-foreground px-4 py-1 !ml-auto leading-3 hover:bg-skeleton transition-colors relative z-[3]'
                                            onClick={(e) => handleFollowToggle(e, user)}
                                        >
                                            <span className='inline-block text-sm'>
                                                {user.youFollow ? 'Unfollow' : 'Follow'}
                                            </span>
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
