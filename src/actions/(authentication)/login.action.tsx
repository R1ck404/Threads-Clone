"use server";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "@/lib/prisma";

type AuthenticationResponse = {
    user: any | null;
    error: string | null;
}

async function authenticateUser({ email, password }: { email: string, password: string }): Promise<AuthenticationResponse> {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return {
            user: null,
            error: 'User not found',
        } as AuthenticationResponse;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return {
            user: null,
            error: 'Invalid password',
        } as AuthenticationResponse;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7 days',
    });

    return {
        user,
        error: null,
    } as AuthenticationResponse;
}

export default authenticateUser;