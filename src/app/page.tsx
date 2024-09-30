import React from 'react'
import Sidebar from '../components/ui/sidebar'
import SuggestedUsers from '../components/pages/suggested_users/suggested_users'
import Post from '../components/ui/post'
import getPosts from '../actions/(posts)/get_posts.action'
import PostInput from '../components/ui/postinput'
import { timeAgo, TimeAgoConfig } from '../lib/time'
import { auth } from '../lib/auth'
import PostsFeed from '@/components/pages/posts/post-feed'

const customTimeConfig: TimeAgoConfig = {
    years: ['y', 'y'],
    months: ['m', 'm'],
    days: ['d', 'd'],
    hours: ['h', 'h'],
    minutes: ['m', 'm'],
    seconds: ['s', 's'],
    template: '{value}{unit} ago',
};

export default async function HomePage() {
    const session = await auth();
    const posts = await getPosts({ limit: 10 })

    return (
        <div className="bg-background text-foreground min-h-screen flex h-full">
            <Sidebar status={session?.user?.id ? 'authenticated' : 'unauthenticated'} />
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-4 divide-y divide-border  border border-border bg-card rounded-2xl">
                    {session?.user && <PostInput username={session.user.username} session_id={session.user.id} />}

                    <PostsFeed initialPosts={posts} session={session} />
                </div>
            </div>
            <SuggestedUsers userId={session?.user?.id || ''} />
        </div>
    )
}
