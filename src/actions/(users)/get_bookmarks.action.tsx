"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getBookmarks({ userId, limit }: { userId: string; limit?: number }) {
    const fetchBookmarks = unstable_cache(
        async () => {
            console.log("CACHE MISS: getBookmarks");
            return await prisma.bookmark.findMany({
                where: { userId: userId },
                select: {
                    post: {
                        select: {
                            id: true,
                            content: true,
                            imageUrl: true,
                            createdAt: true,
                            author: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatarUrl: true,
                                },
                            },
                        },
                    },
                },
                take: limit,
            });
        },
        [`getBookmarks`, userId, (limit || '10').toString()],
        { revalidate: 60 }
    );

    return fetchBookmarks();
}
