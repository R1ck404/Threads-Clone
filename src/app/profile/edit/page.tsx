"use client";

import React, { useEffect, useRef, useState } from 'react';
import { CircleEllipsis, EditIcon } from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import SuggestedUsers from '@/components/pages/suggested_users/suggested_users';
import Instagram from '@/components/icons/instagram';
import ProfileTabs from '@/components/pages/profile/ProfileTabs';
import { formatNumber } from '@/lib/number';
import BackArrow from '@/components/ui/back-arrow';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { updateUserProfile } from '@/actions/(users)/update_user.action';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState(session?.user.username);
    const [bio, setBio] = useState(session?.user.bio || '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const joinedAt = new Date(session?.user.createdAt ?? new Date()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        if (status !== 'authenticated') {
            return;
        }
        console.log(session);
        setUsername(session?.user.username);
        setBio(session?.user.bio || '');
        setAvatarPreview(session?.user.avatarUrl || null);
    }, [status]);

    useEffect(() => {
        if (avatarFile) {
            const objectUrl = URL.createObjectURL(avatarFile);
            setAvatarPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [avatarFile]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setAvatarFile(files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error("You must be logged in to update your profile.");
            return;
        }

        const formData = new FormData();
        formData.append('username', username || '');
        formData.append('bio', bio);

        if (avatarFile) {
            console.log(avatarFile);
            formData.append('avatar', avatarFile, avatarFile.name);
        }

        const response = await updateUserProfile(formData);
        if (response.success) {
            toast.success("Profile updated successfully!");

            const updateUser = async () => {
                await update({
                    user: {
                        ...session.user,
                        username: username,
                        bio: bio,
                        avatarUrl: response?.user?.avatarUrl,
                    },
                });
            };

            updateUser();
        } else {
            toast.error(response.message || "Error updating profile.");
        }
    };

    return (
        <div className="bg-background text-foreground min-h-screen flex h-full">
            <Sidebar status={session?.user?.id ? 'authenticated' : 'unauthenticated'} />
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col max-w-2xl mx-auto space-y-4">
                    <div className="flex w-full justify-between">
                        <BackArrow />
                        <h1 className="text-md">Edit profile</h1>
                        <span className='w-6'></span>
                    </div>

                    <form onSubmit={handleSubmit} className='flex flex-col w-full h-full rounded-2xl border border-border bg-card'>
                        <div className="w-full h-full p-6">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <input
                                        className="bg-neutral-800 border border-neutral-700 py-0.5 px-3 w-full rounded-xl text-lg font-bold"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <p className="text-base text-zinc-400">
                                        Joined at {joinedAt}
                                    </p>
                                </div>

                                <div className='relative w-20 h-20 rounded-full overflow-hidden cursor-pointer'>
                                    <label className="absolute flex justify-center items-center bg-black/70 w-full h-full rounded-full cursor-pointer">
                                        <EditIcon />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="User"
                                            className="size-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={session?.user.avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"}
                                            alt="User"
                                            className="size-20 rounded-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/placeholder-image.jpg?height=40&width=40&text=user';
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            <textarea
                                className="bg-neutral-800 border border-neutral-700 py-0.5 px-3 w-full rounded-xl text-md text-foreground mt-1"
                                placeholder="Bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />

                            <div className='flex justify-between mt-5'>
                                <div className="flex space-x-5">
                                    <p className='text-md text-zinc-500'>
                                        {formatNumber(session?.user.followersCount ?? 0)} Followers
                                    </p>

                                    <div className="w-1 h-1 rounded-full bg-zinc-600 my-auto"></div>

                                    <p className='text-md text-zinc-500'>
                                        {formatNumber(session?.user.followedUsersCount ?? 0)} Following
                                    </p>
                                </div>

                                <div className='flex space-x-2'>
                                    <Instagram className='fill-white' />
                                    <CircleEllipsis className='' />
                                </div>
                            </div>

                            <div className="flex w-full space-x-2 mt-8">
                                <button type="submit" className='w-full bg-white border-white border-2 text-black rounded-xl py-1.5 h-fit'>
                                    Save
                                </button>
                                <button type="button" className='border-border border-2 w-full rounded-xl py-1.5 h-fit' onClick={() => {
                                    router.back();
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <ProfileTabs session_id={session?.user.id} showTabs={false} />

                            <div className="flex flex-col w-full h-full min-h-24 p-6">
                                <div className="flex items-center justify-center w-full border border-neutral-700 rounded-xl border-dotted h-24">
                                    <p className="text-zinc-400 text-sm">Your data will be displayed here</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <SuggestedUsers userId={session?.user?.id || ''} />
        </div>
    );
}
