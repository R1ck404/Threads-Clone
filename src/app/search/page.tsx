import React from 'react';
import Sidebar from '@/components/ui/sidebar';
import SuggestedUsers from '@/components/pages/suggested_users/suggested_users';
import { auth } from '@/lib/auth';
import BackArrow from '@/components/ui/back-arrow';
import SearchSection from '@/components/pages/search/search-section';

export default async function ProfilePage() {
    const session = await auth();

    return (
        <div className="bg-background text-foreground min-h-screen flex h-full">
            <Sidebar status={session?.user?.id ? 'authenticated' : 'unauthenticated'} />
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="flex flex-col max-w-2xl mx-auto space-y-4 h-full">
                    <div className="flex w-full justify-between">
                        <BackArrow />
                        <h1 className="text-md">Search</h1>
                        <span className='w-6'></span>
                    </div>

                    <div className='flex flex-col w-full h-full rounded-2xl border border-border bg-card'>
                        <SearchSection />
                    </div>
                </div>
            </div>
            <SuggestedUsers userId={session?.user?.id || ''} />
        </div>
    )
}
