import React from 'react';
import Sidebar from '@/components/ui/sidebar';
import SuggestedUsers from '@/components/pages/suggested_users/suggested_users';
import { auth } from '@/lib/auth';
import ActivityTabs from '@/components/pages/activity/activity-tabs';
import BackArrow from '@/components/ui/back-arrow';

export default async function ActivityPage() {
    const session = await auth();

    return (
        <div className="bg-background text-foreground min-h-screen flex h-full">
            <Sidebar status={session?.user?.id ? 'authenticated' : 'unauthenticated'} />
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col max-w-2xl mx-auto space-y-4">
                    <div className="flex w-full justify-between">
                        <BackArrow />
                        <h1 className="text-md">Activity</h1>
                        <span className='w-6'></span>
                    </div>

                    <div className='flex flex-col w-full h-full rounded-2xl border border-border bg-card'>
                        <div className="w-full h-full p-6">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold">Actitivy</h1>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col mt-2'>
                            <ActivityTabs session_id={session?.user?.id} />
                        </div>
                    </div>
                </div>
            </div>
            <SuggestedUsers userId={session?.user?.id || ''} />
        </div>
    )
}
