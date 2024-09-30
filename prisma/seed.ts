import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create Users
    const user1 = await prisma.user.create({
        data: {
            username: 'johndoe',
            email: 'johndoe@example.com',
            password: await bcrypt.hash('password123', 10), // Hashing the password
            bio: 'Loving social media!',
            avatarUrl: 'https://example.com/avatar1.png',
            settings: {
                create: {
                    theme: 'dark',
                    notifications: true,
                },
            },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'janedoe',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('password123', 10), // Hashing the password
            bio: 'Exploring the world of social media!',
            avatarUrl: 'https://example.com/avatar2.png',
            settings: {
                create: {
                    theme: 'light',
                    notifications: false,
                },
            },
        },
    });

    const user3 = await prisma.user.create({
        data: {
            username: 'alice',
            email: 'alice@example.com',
            password: await bcrypt.hash('password123', 10), // Hashing the password
            bio: 'Tech enthusiast.',
            avatarUrl: 'https://example.com/avatar3.png',
        },
    });

    const user4 = await prisma.user.create({
        data: {
            username: 'bob',
            email: 'bob@example.com',
            password: await bcrypt.hash('password123', 10), // Hashing the password
            bio: 'Lover of books and movies.',
            avatarUrl: 'https://example.com/avatar4.png',
        },
    });

    // Create Follows
    await prisma.follow.createMany({
        data: [
            { followerId: user1.id, followedId: user2.id }, // John follows Jane
            { followerId: user1.id, followedId: user3.id }, // John follows Alice
            { followerId: user2.id, followedId: user1.id }, // Jane follows John
            { followerId: user2.id, followedId: user4.id }, // Jane follows Bob
            { followerId: user3.id, followedId: user1.id }, // Alice follows John
            { followerId: user4.id, followedId: user2.id }, // Bob follows Jane
        ],
    });

    // Create Posts
    const post1 = await prisma.post.create({
        data: {
            content: 'Hello, world! This is my first post!',
            authorId: user1.id,
        },
    });

    const post2 = await prisma.post.create({
        data: {
            content: 'Welcome to the platform!',
            authorId: user2.id,
        },
    });

    const post3 = await prisma.post.create({
        data: {
            content: 'Just finished a great book!',
            authorId: user4.id,
        },
    });

    // Create Replies
    await prisma.reply.create({
        data: {
            content: 'Thanks for the welcome!',
            postId: post2.id,
            authorId: user1.id,
        },
    });

    // Create Likes
    await prisma.like.create({
        data: {
            postId: post1.id,
            userId: user2.id,
        },
    });

    // Create Bookmarks
    await prisma.bookmark.create({
        data: {
            postId: post1.id,
            userId: user2.id,
        },
    });
}

main()
    .then(() => {
        console.log('Seeding complete!');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
