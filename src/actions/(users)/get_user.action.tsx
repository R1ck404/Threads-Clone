"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type UserData = {
    id: string;
    username: string;
    email: string;
    bio?: string | null;
    avatarUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    followersCount: number;
    followedUsersCount: number;
    posts: {
        id: string;
        content: string;
        imageUrl?: string | null;
        createdAt: Date;
    }[];
    settings: {
        theme: string;
        notifications: boolean;
    } | null;
};

type GetUserParams = {
    userId?: string;
    username?: string;
};

export async function getUser({ userId, username }: GetUserParams): Promise<UserData | null> {
    const fetchUser = unstable_cache(
        async () => {
            console.log("CACHE MISS: getUser");

            const whereClause = userId ? { id: userId } : username ? { username } : null;

            if (!whereClause) {
                return {
                    error: "Invalid parameters",
                }
            }

            const user = await prisma.user.findUnique({
                where: whereClause,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    bio: true,
                    avatarUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    followers: {
                        select: {
                            id: true,
                        },
                    },
                    followedUsers: {
                        select: {
                            id: true,
                        },
                    },
                    posts: {
                        select: {
                            id: true,
                            content: true,
                            imageUrl: true,
                            createdAt: true,
                        },
                    },
                    settings: {
                        select: {
                            theme: true,
                            notifications: true,
                        },
                    },
                },
            });

            if (!user) return null;

            return {
                ...user,
                followersCount: user.followers.length,
                followedUsersCount: user.followedUsers.length,
                posts: user.posts,
                settings: user.settings,
            };
        },

        [`getUser`, userId || username || "unknown"],
        { revalidate: 60 }
    );

    return fetchUser() as any;
}
