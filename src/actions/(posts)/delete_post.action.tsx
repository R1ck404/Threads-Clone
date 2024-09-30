"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deletePost({ postId }: { postId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to delete a post.",
        };
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        return {
            error: "Post not found.",
        };
    }

    if (post.authorId !== session.user.id) {
        return {
            error: "You are not authorized to delete this post.",
        };
    }

    await prisma.$transaction([
        prisma.like.deleteMany({
            where: { postId },
        }),
        prisma.bookmark.deleteMany({
            where: { postId },
        }),
        prisma.reply.deleteMany({
            where: { postId },
        }),
        prisma.post.delete({
            where: { id: postId },
        }),
    ]);

    return {
        success: "Post and all associated data (likes, bookmarks, replies) successfully deleted.",
    };
}
