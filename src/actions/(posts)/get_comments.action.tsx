"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type CommentData = {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        id: string;
        username: string;
        avatarUrl?: string | null;
    };
    post: {
        id: string;
        content: string;
        imageUrl?: string | null;
    };
    error?: string;
};

export async function getComments({ userId, username, limit }: { userId?: string; username?: string; limit?: number }): Promise<CommentData[]> {
    if (!userId && !username) {
        return [];
    }

    const fetchComments = unstable_cache(
        async () => {
            console.log("CACHE MISS: getComments");
            const user = await prisma.user.findUnique({
                where: {
                    id: userId || undefined,
                    username: username || undefined,
                },
                select: {
                    id: true,
                    posts: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            if (!user) {
                throw new Error("User not found");
            }

            const comments = await prisma.reply.findMany({
                where: {
                    postId: {
                        in: user.posts.map((post) => post.id),
                    },
                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            content: true,
                            imageUrl: true,
                        },
                    },
                },
                take: limit,
            });

            return comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                author: {
                    id: comment.author.id,
                    username: comment.author.username,
                    avatarUrl: comment.author.avatarUrl,
                },
                post: {
                    id: comment.post.id,
                    content: comment.post.content,
                    imageUrl: comment.post.imageUrl,
                },
            }));
        },

        [`getComments`, userId || "unknown", username || "unknown", (limit || "10").toString()],
        { revalidate: 60 }
    );

    return fetchComments();
}