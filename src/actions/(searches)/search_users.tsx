"use server"

import { prisma } from '@/lib/prisma';

export default async function searchUsers({ query, limit = 10 }: { query: string, limit?: number }) {
    const formattedQuery = query.trim().toLowerCase();

    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: formattedQuery,
                        mode: 'insensitive'
                    }
                },
                {
                    bio: {
                        contains: formattedQuery,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        take: limit,
        select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
            createdAt: true
        },
        orderBy: {
            username: 'asc'
        }
    });

    return users;
}
