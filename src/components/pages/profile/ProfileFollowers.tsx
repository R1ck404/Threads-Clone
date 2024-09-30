"use client";

import { getFollowers } from "@/actions/(users)/get_followers.action";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export default function ProfileFollowers({ customTimeConfig, session_id }: { customTimeConfig: any; session_id?: string; }) {
    const [followers, setFollowers] = useState<any[] | null>(null);

    useEffect(() => {
        async function fetchFollowers() {
            if (!session_id) return;

            const fetchFollowers = await getFollowers({ userId: session_id });
            setFollowers(fetchFollowers);
        }

        fetchFollowers();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-24 p-6">
            {followers === null ? (
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
                followers.length === 0 ? (
                    <div className="flex items-center justify-center w-full border border-neutral-700 rounded-xl border-dotted h-24">
                        <p className="text-foreground">No followers</p>
                    </div>
                ) : (
                    followers.map((follower: any, index: number) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col w-full space-y-4 relative group">
                                <div className="!mb-0 absolute -inset-x-2 -inset-y-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                                <Link className="flex items-center space-x-2 z-[2] !mt-0" href={`/@${follower.follower.username}`}>
                                    <img src={follower.follower.avatarUrl || '/placeholder.svg?height=40&width=40'} alt="User" className="w-12 h-12 rounded-full"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&";
                                        }} />
                                    <div className="flex flex-col w-full">
                                        <div className="flex items-center w-full space-x-2">
                                            <h1 className="text-md font-bold">{follower.follower.username}</h1>
                                            <div className="relative group/ellipsis !ml-auto !mr-2">
                                                <EllipsisIcon className="w-4 h-4 text-gray-400" />
                                                <div className="absolute h-4 w-4 p-4 -inset-x-2 -inset-y-2 z-0 scale-90 opacity-0 transition group-hover/ellipsis:scale-100 group-hover/ellipsis:opacity-100 sm:rounded-2xl bg-zinc-700/50"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                            </div>

                            {index < followers?.length - 1 && <hr className="my-4 border-border" />}
                        </React.Fragment>
                    ))
                )
            )}
        </div>
    )
}