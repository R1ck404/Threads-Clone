"use client";

import { getBookmarks } from "@/actions/(users)/get_bookmarks.action";
import { timeAgo } from "@/lib/time";
import React from "react";
import { useEffect, useState } from "react";
import BookmarkPost from "./bookmark-post";

export default function BookmarkList({ customTimeConfig, session_id }: { customTimeConfig: any; session_id?: string; }) {
    const [bookmarks, setBookmarks] = useState<any[] | null>(null);

    useEffect(() => {
        async function fetchBookmarks() {
            if (!session_id) return;

            const fetched_bookmarks = await getBookmarks({ userId: session_id });
            // console.log(fetchFollowers);
            setBookmarks(fetched_bookmarks);

            console.log(fetched_bookmarks);
        }

        fetchBookmarks();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-24 p-1">
            {bookmarks === null ? (
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
                bookmarks.length === 0 ? (
                    <div className="flex items-center justify-center w-full border border-neutral-700 rounded-xl border-dotted h-24">
                        <p className="text-foreground">No bookmarks</p>
                    </div>
                ) : (
                    bookmarks.map((bookmark: any, index: number) => {
                        const images = bookmark.post.imageUrl && JSON.parse(bookmark.post.imageUrl) !== null ? JSON.parse(bookmark.post.imageUrl) : null;

                        return <React.Fragment key={index}>
                            <BookmarkPost
                                post_id={bookmark.post.id}
                                username={bookmark.post.author.username}
                                avatarUrl={bookmark.post.author.avatarUrl}
                                timeAgo={timeAgo(bookmark.post.createdAt, customTimeConfig)}
                                content={bookmark.post.content}
                                images={images}
                            />

                            {index < bookmarks?.length - 1 && <hr className="my-1 border-border" />}
                        </React.Fragment>
                    })
                )
            )}
        </div>
    )
}