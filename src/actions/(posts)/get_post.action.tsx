"use server";

import { prisma } from "@/lib/prisma";

async function getPost({ id }: { id: string }) {
    return await prisma.post.findUnique({
        where: { id },
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
}

export default getPost;
