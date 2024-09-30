"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getFollowers({ userId, limit }: { userId: string; limit?: number }) {
    const fetchFollowers = unstable_cache(
        async () => {
            console.log("CACHE MISS: getFollowers");
            return await prisma.follow.findMany({
                where: { followedId: userId },
                select: {
                    follower: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                },
                take: limit,
            });
        },

        [`getFollowers`, userId, (limit || '10').toString()],
        { revalidate: 60 }
    );

    return fetchFollowers();
}

export async function getSuggestedUsers({ userId }: { userId: string }) {
    const fetchSuggestedUsers = unstable_cache(
        async () => {
            console.log("CACHE MISS: getSuggestedUsers");
            const followersNotFollowedBack = await prisma.follow.findMany({
                where: {
                    followedId: userId,
                    NOT: {
                        follower: {
                            followers: {
                                some: {
                                    followedId: userId,
                                },
                            },
                        },
                    },
                },
                select: {
                    follower: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            const usersFollowingBack = followersNotFollowedBack.map((f) => f.follower);

            if (usersFollowingBack.length < 4) {
                const otherUsers = await prisma.user.findMany({
                    where: {
                        NOT: {
                            id: userId,
                        },
                    },
                    orderBy: {
                        followers: { _count: "desc" },
                    },
                    take: 4 - usersFollowingBack.length,
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        followers: {
                            where: {
                                followerId: userId,
                            },
                            select: {
                                id: true,
                            },
                        },
                    },
                });

                const popularUsers = otherUsers.map((user) => ({
                    ...user,
                    youFollow: user.followers.length > 0,
                }));

                usersFollowingBack.push(...popularUsers);
            }

            return usersFollowingBack
                .map((user) => ({
                    ...user,
                    youFollow: (user as any).followers?.length > 0,
                }))
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
        },
        [`getSuggestedUsers`, userId],
        { revalidate: 60 }
    );

    return fetchSuggestedUsers();
}

export async function getFollowing({ userId }: { userId: string }) {
    const fetchFollowing = unstable_cache(
        async () => {
            console.log("CACHE MISS: getFollowing");
            return await prisma.follow.findMany({
                where: { followerId: userId },
                select: {
                    followed: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                },
            });
        },
        [`getFollowing`, userId],
        { revalidate: 60 }
    );

    return fetchFollowing();
}