"use server";

import { prisma } from "@/lib/prisma";

async function getPosts({
    limit = 10,
    cursor,
    userId,
}: {
    limit?: number;
    cursor?: string;
    userId?: string
}) {
    return await prisma.post.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        where: userId ? { authorId: userId } : {},
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
            replies: {
                select: {
                    id: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                    createdAt: true,
                },
            },
            likes: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            bookmarks: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });
}

export default getPosts;
