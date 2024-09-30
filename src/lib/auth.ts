import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export type UserData = {
    id: string;
    username: string;
    email: string;
    bio?: string | null;
    avatarUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    followers: { id: string }[];
    followedUsers: { id: string }[];
    settings: {
        theme: string;
        notifications: boolean;
    } | null;
};

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            bio: string | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            followersCount: number;
            followedUsersCount: number;
            settings: {
                theme: string;
                notifications: boolean;
            } | null;
        };
    }

    interface User extends UserData { }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string;
                const password = credentials?.password as string;

                const user = await prisma.user.findUnique({
                    where: { email },
                    include: {
                        followers: true,
                        followedUsers: true,
                        settings: true,
                    },
                });

                if (!user) {
                    console.log("User not found");
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    console.log("Invalid password");
                    return null;
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, trigger, user }) {
            if (user) {
                const sessionUser = user as UserData;
                token.id = sessionUser.id;
                token.username = sessionUser.username;
                token.email = sessionUser.email;
                token.bio = sessionUser.bio || null;
                token.avatarUrl = sessionUser.avatarUrl || null;
                token.createdAt = sessionUser.createdAt;
                token.updatedAt = sessionUser.updatedAt;
                token.followersCount = sessionUser.followers.length;
                token.followedUsersCount = sessionUser.followedUsers.length;
                token.settings = sessionUser.settings;
            }

            if (trigger === "update") {
                const updatedUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    include: {
                        followers: true,
                        followedUsers: true,
                        settings: true,
                    },
                });

                if (!updatedUser) {
                    return token;
                }

                token.id = updatedUser.id;
                token.username = updatedUser.username;
                token.email = updatedUser.email;
                token.bio = updatedUser.bio || null;
                token.avatarUrl = updatedUser.avatarUrl || null;
                token.createdAt = updatedUser.createdAt;
                token.updatedAt = updatedUser.updatedAt;
                token.followersCount = updatedUser.followers.length;
                token.followedUsersCount = updatedUser.followedUsers.length;
                token.settings = updatedUser.settings;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    username: token.username as string,
                    email: token.email as string,
                    bio: token.bio as string | null,
                    avatarUrl: token.avatarUrl as string | null,
                    createdAt: new Date(token.createdAt as string),
                    updatedAt: new Date(token.updatedAt as string),
                    followersCount: token.followersCount as number,
                    followedUsersCount: token.followedUsersCount as number,
                    settings: token.settings as {
                        theme: string;
                        notifications: boolean;
                    } | null,
                } as any;
            }
            return session;
        },
    },
});
