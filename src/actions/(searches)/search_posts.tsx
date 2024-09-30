"use server";

import { prisma } from "@/lib/prisma";

export default async function searchPosts({ query, limit = 10, cursor }: { query: string, limit?: number, cursor?: string }) {
    const formattedQuery = query.trim().toLowerCase();

    const posts = await prisma.post.findMany({
        where: {
            OR: [
                {
                    content: {
                        contains: formattedQuery,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: `#${formattedQuery}`,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            content: true,
            imageUrl: true,
            createdAt: true,
            updatedAt: true,
            bookmarks: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            username: false,
                            avatarUrl: false,
                        },
                    },
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
            replies: {
                select: {
                    id: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                    content: true,
                    createdAt: true,
                },
            },
            author: {
                select: {
                    id: true,
                    username: true,
                    bio: true,
                    avatarUrl: true,
                },
            },
        },
    });

    return posts;
}
