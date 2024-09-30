"use server";

import bcrypt from 'bcryptjs';
import { prisma } from "@/lib/prisma";

type RegistrationResponse = {
    user: any | null;
    error: string | null;
}

const isPasswordSecure = (password: string) => {
    const secureLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    return secureLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
}

async function registerUser({ username, email, password }: { username: string, email: string, password: string }): Promise<RegistrationResponse> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    email: email,
                },
                {
                    username: username,
                },
            ],
        },
    });

    if (userExists) {
        return {
            user: null,
            error: 'User already exists',
        } as RegistrationResponse;
    }

    if (!isPasswordSecure(password)) {
        return {
            user: null,
            error: 'Password not secure',
        } as RegistrationResponse;
    }

    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
        },
    });

    return {
        user,
        error: null,
    } as RegistrationResponse;
}

export default registerUser;