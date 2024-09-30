"use client";

import { TimeAgoConfig } from "@/lib/time";
import { motion } from "framer-motion";
import { useState } from "react";
import ProfilePictures from "./ProfilePics";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";

const customTimeConfig: TimeAgoConfig = {
    years: ['y', 'y'],
    months: ['m', 'm'],
    days: ['d', 'd'],
    hours: ['h', 'h'],
    minutes: ['m', 'm'],
    seconds: ['s', 's'],
    template: '{value}{unit}',
};

export default function ProfileTabs({ session_id, showTabs = true }: { session_id?: string, showTabs?: boolean }) {
    const [selectedTab, setSelectedTab] = useState('posts');

    const tabs = [
        { id: 'posts', label: 'Posts' },
        { id: 'followers', label: 'Followers' },
        { id: 'following', label: 'Following' },
    ];

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex space-x-1 w-full border-b border-b-neutral-800">
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
                                className="absolute inset-0 z-10 border-b border-white mix-blend-difference"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>

            {showTabs && (
                <div className="flex flex-col w-full h-full">
                    {selectedTab === 'posts' && (
                        <ProfilePictures
                            session_id={session_id}
                            customTimeConfig={customTimeConfig}
                        />
                    )}

                    {selectedTab === 'followers' && (
                        <ProfileFollowers
                            session_id={session_id}
                            customTimeConfig={customTimeConfig}
                        />
                    )}

                    {selectedTab === 'following' && (
                        <ProfileFollowing
                            session_id={session_id}
                            customTimeConfig={customTimeConfig}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
