"use client";

import React, { useEffect, useState } from 'react';
import { followUser, unfollowUser } from '@/actions/(users)/follow.action';
import { getSuggestedUsers } from '@/actions/(users)/get_followers.action';


export default function SuggestedUsersSkeleton() {

    return (
        <>
            <div className="flex items-center space-x-2 w-full">
                <div className='w-10 h-10 bg-skeleton rounded-full animate-pulse'></div>
                <div className="flex flex-col h-min space-y-1">
                    <div className='w-20 h-4 bg-skeleton rounded animate-pulse'></div>
                    <div className='w-10 h-3 bg-skeleton rounded animate-pulse'></div>
                </div>
                <div className='w-10 h-3 bg-skeleton rounded animate-pulse !ml-auto'></div>
            </div>
            <div className="flex justify-between w-full my-4">
                <div className='w-24 h-4 bg-skeleton rounded animate-pulse'></div>
                <div className='w-14 h-3 bg-skeleton rounded animate-pulse'></div>
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((user) => (
                    <div key={user} className="flex items-center space-x-2">
                        <div className='w-8 h-8 bg-skeleton rounded-full animate-pulse'></div>

                        <div className="flex flex-col h-min space-y-1">

                            <div className='w-20 h-4 bg-skeleton rounded animate-pulse'></div>
                            <div className='w-10 h-3 bg-skeleton rounded animate-pulse'></div>
                        </div>

                        <div className='w-16 h-6 bg-skeleton rounded animate-pulse !ml-auto'></div>
                    </div>
                ))}
            </div>
        </>
    )
}