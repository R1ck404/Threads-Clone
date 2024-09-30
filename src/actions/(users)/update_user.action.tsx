"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateUserProfile(formData: FormData) {
    const session = await auth();

    if (!session || !session.user) {
        return { success: false, message: "You must be logged in to update your profile." };
    }

    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;
    const avatar = formData.get('avatar') as File;

    if (!username || username.trim() === "") {
        return { success: false, message: "Username is required." };
    }

    let avatarUrl: string | null = null;
    if (avatar) {
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload_images`, {
            method: 'POST',
            body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
            avatarUrl = uploadResult.urls[0];
        } else {
            return { success: false, message: uploadResult.message || "Failed to upload avatar." };
        }
    }

    if (avatarUrl !== null && avatarUrl?.trim() !== "") {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                username: username,
                bio: bio,
                avatarUrl: avatarUrl,
            },
        });
    } else {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                username: username,
                bio: bio,
            },
        });
    }

    return { success: true, user: { avatarUrl } };
}
