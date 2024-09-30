import { getFollowers } from "@/actions/(users)/get_followers.action";
import { Paperclip } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export default function ActivityFollowers({ customTimeConfig, session_id }: { customTimeConfig: any; session_id?: string; }) {
    const [followers, setFollowers] = useState<any[] | null>(null);

    useEffect(() => {
        async function fetchAllFollowers() {
            const fetchFollower = await getFollowers({ userId: session_id || '', limit: 10 });
            console.log("followers", fetchFollower);
            setFollowers(fetchFollower);
        }

        fetchAllFollowers();
    }, []);

    return (
        <div className="flex flex-col w-full h-full px-3 p-4">
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
                            <Link key={follower.follower.id} className="flex items-center w-full space-x-2 p-2 relative group" href={`/@${follower.follower.username}`}>
                                <div className="absolute -inset-x-2 -inset-y-2 scale-90 mx-2 mt-1.5 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>

                                <img src={follower.follower.avatarUrl || '/placeholder-image.jpg?height=40&width=40&text=user'} alt="User" className="size-10 rounded-full z-[2]"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = '/placeholder-image.jpg?height=40&width=40&text=user';
                                    }}
                                />
                                <div className="flex flex-col w-full z-[2]">
                                    <div className="flex w-full justify-between">
                                        <div className="flex flex-col">
                                            <div className="flex space-x-2 items-center">
                                                <p className="text-md text-zinc-200 font-semibold">
                                                    {follower.follower.username}

                                                </p>
                                            </div>
                                            <p className="text-sm text-zinc-400">followed you</p>
                                        </div>
                                        <button>
                                            <Paperclip size={24} className="text-neutral-600" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                            {index < followers?.length - 1 && <hr className="my-4 border-border" />}
                        </React.Fragment>
                    ))
                )
            )}
        </div>
    )
}