import React from 'react';
import { CircleEllipsis } from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import SuggestedUsers from '@/components/pages/suggested_users/suggested_users';
import { auth } from '@/lib/auth';
import Instagram from '@/components/icons/instagram';
import ProfileTabs from '@/components/pages/profile/ProfileTabs';
import { formatNumber } from '@/lib/number';
import BackArrow from '@/components/ui/back-arrow';
import Link from 'next/link';
import ShareProfileButton from '@/components/ui/share-profile-button';

export default async function ProfilePage() {
    const session = await auth();
    const joinedAt = new Date(session?.user.createdAt ?? new Date()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const session_id = session?.user.id;

    return (
        <div className="bg-background text-foreground min-h-screen flex h-full">
            <Sidebar status={session?.user?.id ? 'authenticated' : 'unauthenticated'} />
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col max-w-2xl mx-auto space-y-4">
                    <div className="flex w-full justify-between">
                        <BackArrow />
                        <h1 className="text-md">Profile</h1>
                        <span className='w-6'></span>
                    </div>

                    <div className='flex flex-col w-full h-full rounded-2xl border border-border bg-card'>
                        <div className="w-full h-full p-6">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold">{session?.user.username}</h1>
                                    <p className="text-base text-zinc-400">
                                        Joined at {joinedAt}
                                    </p>
                                </div>

                                <img src={session?.user.avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"} alt="User" className="size-20 rounded-full" />
                            </div>

                            <p className='text-md text-foreground mt-4'>This is a user profile page. It will display the user's information and posts.</p>

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
                                <Link href='/profile/edit' className='w-full bg-white border-white border-2 text-black rounded-xl py-1.5 h-fit text-center'>
                                    Edit
                                </Link>
                                <ShareProfileButton username={session?.user?.username ?? null} />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <ProfileTabs session_id={session_id} />
                        </div>
                    </div>
                </div>
            </div>
            <SuggestedUsers userId={session?.user?.id || ''} />
        </div>
    )
}
