import React, { useEffect, useState } from "react";
import { Paperclip } from "lucide-react";
import { getLikes } from "@/actions/(users)/get_likes.action";
import { getComments } from "@/actions/(posts)/get_comments.action";
import { getFollowers } from "@/actions/(users)/get_followers.action";
import Link from "next/link";

export default function ActivityAll({ customTimeConfig, session_id }: { customTimeConfig: any, session_id?: string }) {
    const [activities, setActivities] = useState<any[] | null>(null);

    useEffect(() => {
        async function fetchAllActivities() {
            const [likes, comments, followers] = await Promise.all([
                getLikes({ userId: session_id || '', limit: 5 }),
                getComments({ userId: session_id || '', limit: 5 }),
                getFollowers({ userId: session_id || '', limit: 5 }),
            ]);

            const combinedActivities = [
                ...likes.map((like: any) => ({ ...like, type: 'like' })),
                ...comments.map((comment: any) => ({ ...comment, type: 'comment' })),
                ...followers.map((follower: any) => ({ ...follower, type: 'follower' }))
            ];

            combinedActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setActivities(combinedActivities);
            console.log("activities", combinedActivities);
        }

        fetchAllActivities();
    }, [session_id]);

    return (
        <div className="flex flex-col w-full h-full p-4 px-3 space-y-4">
            {activities === null ? (
                <div className="flex flex-col w-full h-full space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
                        <div className="flex flex-col w-full space-y-2">
                            <div className="w-1/2 h-4 bg-neutral-700 rounded"></div>
                            <div className="w-1/4 h-4 bg-neutral-700 rounded"></div>
                        </div>
                    </div>
                </div>
            ) : (activities.length === 0 ? (
                <div className="flex items-center justify-center w-full border border-neutral-700 rounded-xl border-dotted h-24">
                    <p className="text-foreground">No activity found</p>
                </div>
            ) : (
                activities.map((activity, index) => (
                    <React.Fragment key={index}>
                        <Link className="flex items-center w-full space-x-2 p-2 relative group" href={`
                                ${activity.type === 'like' ? `/@${activity.user?.username}/posts/${activity.post?.id}` : ''}
                                ${activity.type === 'comment' ? `/@${activity.author?.username}/posts/${activity.post?.id}` : ''}
                                ${activity.type === 'follower' ? `/@${activity.follower?.username}` : ''}
                            `}>
                            <div className="absolute -inset-x-2 -inset-y-2 scale-90 mx-2 mt-1.5 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>

                            <img
                                src={activity?.author?.avatarUrl || '/placeholder-image.jpg?height=40&width=40&text=user'}
                                alt="User"
                                className="size-10 rounded-full z-[2]"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/placeholder-image.jpg?height=40&width=40&text=user';
                                }}
                            />
                            <div className="flex flex-col w-full z-[2]">
                                <div className="flex w-full justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex space-x-1 items-center">
                                            <p className="text-md text-zinc-400">
                                                <span className="font-semibold text-zinc-200 mr-1.5">
                                                    {activity.author?.username || activity.follower?.username || activity.user?.username}
                                                </span>
                                                {activity.type === 'like' && `liked a post`}
                                                {activity.type === 'comment' && activity.content}
                                                {activity.type === 'follower' && `started following you`}
                                            </p>
                                        </div>
                                        <p className="text-sm text-zinc-400">{activity.createdAt && customTimeConfig(activity.createdAt)}</p>
                                    </div>
                                    <button>
                                        <Paperclip size={24} className="text-neutral-600" />
                                    </button>
                                </div>
                            </div>
                        </Link>

                        {index < activities.length - 1 && <hr className="my-4 border-border" />}
                    </React.Fragment>
                ))
            ))}
        </div>
    );
}
