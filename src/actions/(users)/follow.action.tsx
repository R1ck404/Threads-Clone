"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function followUser({ followerId, followedId }: { followerId: string; followedId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        }
    }

    if (session.user.id !== followerId) {
        return {
            error: "There was an error following this user.",
        };
    }

    return await prisma.follow.create({
        data: {
            follower: { connect: { id: followerId } },
            followed: { connect: { id: followedId } },
        },
    });
}

export async function unfollowUser({ followerId, followedId }: { followerId: string; followedId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        }
    }

    if (session.user.id !== followerId) {
        return {
            error: "There was an error unfollowing this user.",
        };
    }

    return await prisma.follow.deleteMany({
        where: {
            followerId,
            followedId,
        },
    });
}

export async function isFollowing({ followerId, followedId }: { followerId: string; followedId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        }
    }

    if (session.user.id !== followerId) {
        return {
            error: "There was an error checking if you are following this user.",
        };
    }

    return await prisma.follow.findFirst({
        where: {
            followerId,
            followedId,
        },
    });
}

export default async function toggleFollow({ followerId, followedId }: { followerId: string; followedId: string }) {
    const session = await auth();

    if (session === null || session.user === null) {
        return {
            error: "You must be logged in to do this.",
        }
    }

    if (session.user.id !== followerId) {
        return {
            error: "There was an error following this user.",
        };
    }

    const follow = await isFollowing({ followerId, followedId });

    if (follow) {
        await unfollowUser({ followerId, followedId });
    } else {
        await followUser({ followerId, followedId });
    }
}