"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function commentOnPost({ postId, userId, content }: { postId: string; userId: string; content: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        };
    }

    if (session.user.id !== userId) {
        return {
            error: "There was an error commenting on this post.",
        };
    }

    const comment = await prisma.reply.create({
        data: {
            content,
            author: {
                connect: {
                    id: userId,
                },
            },
            post: {
                connect: {
                    id: postId,
                },
            },
        },
    });

    return comment;
}

export default commentOnPost;
