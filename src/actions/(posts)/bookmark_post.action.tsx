"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function toggleBookmarkOnPost({ postId, userId }: { postId: string, userId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        };
    }

    if (session.user.id !== userId) {
        return {
            error: "There was an error bookmarking this post.",
        };
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            bookmarks: {
                where: {
                    userId,
                },
            },
        },
    });

    if (post?.bookmarks.length) {
        await prisma.bookmark.delete({
            where: {
                id: post.bookmarks[0].id,
            },
        });

        console.log("Unbookmarked post");
        return {
            bookmarked: false,
        }
    } else {
        await prisma.bookmark.create({
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
            bookmarked: true,
        }
    }
}

export default toggleBookmarkOnPost;