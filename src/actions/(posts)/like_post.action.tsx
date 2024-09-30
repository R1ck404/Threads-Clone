"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function toggleLikeOnPost({ postId, userId }: { postId: string, userId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        }
    }

    if (session.user.id !== userId) {
        return {
            error: "There was an error liking this post.",
        };
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            likes: {
                where: {
                    userId,
                },
            },
        },
    });

    if (post?.likes.length) {
        await prisma.like.delete({
            where: {
                id: post.likes[0].id,
            },
        });

        return {
            liked: false,
        }
    } else {
        await prisma.like.create({
            data: {
                post: {
                    connect: {
                        id: postId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        return {
            liked: true,
        }
    }
}

export default toggleLikeOnPost;
