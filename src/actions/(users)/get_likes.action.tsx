"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type LikeData = {
    id: string;
    createdAt: Date;
    user: {
        id: string;
        username: string;
        avatarUrl?: string | null;
    };
    post: {
        id: string;
        content: string;
        imageUrl?: string | null;
    };
};

export async function getLikes({ postId, userId, limit }: { postId?: string; userId?: string; limit?: number }): Promise<LikeData[]> {
    const fetchLikes = unstable_cache(
        async () => {
            console.log("CACHE MISS: getLikes");
            const whereClause: any = {};

            if (postId) {
                whereClause.postId = postId;
            }
            if (userId) {
                whereClause.userId = userId;
            }

            const likes = await prisma.like.findMany({
                where: whereClause,
                select: {
                    id: true,
                    createdAt: true,
                    user: {
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

            return likes.map((like) => ({
                id: like.id,
                createdAt: like.createdAt,
                user: {
                    id: like.user.id,
                    username: like.user.username,
                    avatarUrl: like.user.avatarUrl,
                },
                post: {
                    id: like.post.id,
                    content: like.post.content,
                    imageUrl: like.post.imageUrl,
                },
            }));
        },

        [`getLikes`, postId || "all", userId || "all", (limit || '10').toString()],
        { revalidate: 60 }
    );

    return fetchLikes();
}
