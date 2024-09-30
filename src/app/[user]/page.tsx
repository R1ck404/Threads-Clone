import React from 'react';
import { CircleEllipsis } from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import SuggestedUsers from '@/components/pages/suggested_users/suggested_users';
import { auth } from '@/lib/auth';
import Instagram from '@/components/icons/instagram';
import ProfileTabs from '@/components/pages/profile/ProfileTabs';
import { getUser } from '@/actions/(users)/get_user.action';
import { formatNumber } from '@/lib/number';
import FollowUserButton from '@/components/ui/follow-user-button';
import BackArrow from '@/components/ui/back-arrow';
import ShareProfileButton from '@/components/ui/share-profile-button';

export default async function ProfilePage({ params }: { params: { [anyProp: string]: string } }) {
    const session = await auth();
    const username = params.user;

    const testUsername = username.replace('@', '').replace('%40', '');
    const user = await getUser({ username: testUsername as string });

    const joinedAt = new Date(user?.createdAt ?? new Date()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-background text-foreground min-h-screen flex h-full">
            <Sidebar status={session?.user?.id ? 'authenticated' : 'unauthenticated'} />
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col max-w-2xl mx-auto space-y-4">
                    <div className="flex w-full justify-between">
                        <BackArrow />
                        <h1 className="text-md">{user?.username}</h1>
                        <span className='w-6'></span>
                    </div>

                    <div className='flex flex-col w-full h-full rounded-2xl border border-border bg-card'>
                        <div className="w-full h-full p-6">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold">{user?.username}</h1>
                                    <p className="text-base text-zinc-400">
                                        Joined at {joinedAt}
                                    </p>
                                </div>

                                <img src={user?.avatarUrl ?? "/placeholder-image.jpg?height=40&width=40&text=user"} alt="User" className="size-20 rounded-full" />
                            </div>

                            <p className='text-md text-foreground mt-4'>{user?.bio ?? ""}</p>

                            <div className='flex justify-between mt-5'>
                                <div className="flex space-x-5">
                                    <p className='text-md text-zinc-500'>
                                        {formatNumber(user?.followersCount ?? 0)} Followers
                                    </p>

                                    <div className="w-1 h-1 rounded-full bg-zinc-600 my-auto"></div>

                                    <p className='text-md text-zinc-500'>
                                        {formatNumber(user?.followedUsersCount ?? 0)} Following
                                    </p>
                                </div>

                                <div className='flex space-x-2'>
                                    <Instagram className='fill-white' />
                                    <CircleEllipsis className='' />
                                </div>
                            </div>

                            <div className="flex w-full space-x-2 mt-8">
                                <FollowUserButton userId={user?.id || ''} session_id={session?.user.id || ''} />

                                <ShareProfileButton />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <ProfileTabs session_id={user?.id} />
                        </div>
                    </div>
                </div>
            </div>
            <SuggestedUsers userId={user?.id || ''} />
        </div>
    )
}
