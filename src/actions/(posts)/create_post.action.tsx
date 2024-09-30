"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function createPost({ content, images, authorId }: { content: string; images?: string[]; authorId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        };
    }

    if (session.user.id !== authorId) {
        return {
            error: "There was an error creating this post.",
        };
    }

    const newPost = await prisma.post.create({
        data: {
            content,
            imageUrl: images ? JSON.stringify(images) : undefined,
            author: {
                connect: { id: authorId },
            },
        },
        select: {
            id: true,
            content: true,
            imageUrl: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
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
                            username: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
        },
    });

    return newPost;
}

export default createPost;
