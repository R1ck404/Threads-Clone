"use client";

import { timeAgo } from "@/lib/time";
import { motion } from "framer-motion";
import { useState } from "react";
import ActivityLikes from "./activity-likes";
import ActivityComments from "./activity-comments";
import ActivityFollowers from "./activity-followers";
import ActivityAll from "./activity-all";

export default function ActivityTabs({ session_id }: { session_id?: string }) {
    const [selectedTab, setSelectedTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'followers', label: 'Followers' },
        { id: 'comments', label: 'Comments' },
        { id: 'likes', label: 'Likes' },
    ];

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex space-x-1 w-full border-b border-b-neutral-800 p-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`${selectedTab === tab.id ? "" : "hover:text-foreground/60"
                            } relative w-full px-3 py-1.5 text-md font-medium text-foreground outline-sky-400 transition focus-visible:outline-2`}
                        style={{
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {selectedTab === tab.id && (
                            <motion.span
                                layoutId="bubble"
                                className="absolute inset-0 z-10 border-b bg-white  rounded-lg mix-blend-difference"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col w-full h-full">
                {selectedTab === 'all' && (
                    <ActivityAll customTimeConfig={timeAgo} session_id={session_id} />
                )}

                {selectedTab === 'followers' && (
                    <ActivityFollowers customTimeConfig={timeAgo} session_id={session_id} />
                )}

                {selectedTab === 'comments' && (
                    <ActivityComments customTimeConfig={timeAgo} session_id={session_id} />
                )}

                {selectedTab === 'likes' && (
                    <ActivityLikes customTimeConfig={timeAgo} session_id={session_id} />
                )}
            </div>
        </div>
    )
}
