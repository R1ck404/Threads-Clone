import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: `${process.env.DATABASE_URL}?connect_timeout=10&pool_timeout=10`,
            },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;