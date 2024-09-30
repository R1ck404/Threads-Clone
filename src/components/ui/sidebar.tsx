import { AlignJustifyIcon, BookmarkIcon, HeartIcon, HomeIcon, LogInIcon, SearchIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CustomPopover from './menu-popover';
import LogoutButton from './logout-button';
import { ExtraSettingsButton } from './extra-settings-button';

function Skeleton() {
    return (
        <div className="flex items-center space-x-2 p-2 text-gray-300 animate-pulse">
            <div className="w-6 h-6 bg-gray-400 rounded-md"></div>
            <span className="hidden sm:inline w-20 h-4 bg-gray-400 rounded-md"></span>
        </div>
    );
}

export default function Sidebar({ status }: { status: 'loading' | 'unauthenticated' | 'authenticated' }) {
    return (
        <div className="w-16 sm:w-72 h-screen relative">
            <div className="fixed top-0 left-0 p-4 flex flex-col h-full border-r border-border max-w-72 w-full">
                <div className="mb-8">
                    <svg className="w-8 h-8 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <nav className="space-y-5">
                    {status === 'loading' ? (
                        <>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </>
                    ) : (
                        <>
                            <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-foreground relative group w-fit px-2 transition-colors">
                                <HomeIcon className="w-6 h-6 z-[2]" />
                                <span className="hidden sm:inline z-[2]">Home</span>
                                <div className="absolute -inset-x-3 -inset-y-1 -mx-2 -my-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                            </Link>

                            <Link href="/search" className="flex items-center space-x-2 text-gray-400 hover:text-foreground relative group w-fit px-2 transition-colors">
                                <SearchIcon className="w-6 h-6 z-[2]" />
                                <span className="hidden sm:inline z-[2]">Search</span>
                                <div className="absolute -inset-x-3 -inset-y-1 -mx-2 -my-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                            </Link>

                            {status === 'authenticated' && (
                                <>
                                    <Link href="/bookmarks" className="flex items-center space-x-2 text-gray-400 hover:text-foreground relative group w-fit px-2 transition-colors">
                                        <BookmarkIcon className="w-6 h-6 z-[2]" />
                                        <span className="hidden sm:inline z-[2]">Bookmarks</span>
                                        <div className="absolute -inset-x-3 -inset-y-1 -mx-2 -my-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                                    </Link>

                                    <Link href="/activity" className="flex items-center space-x-2 text-gray-400 hover:text-foreground relative group w-fit px-2 transition-colors">
                                        <HeartIcon className="w-6 h-6 z-[2]" />
                                        <span className="hidden sm:inline z-[2]">Activity</span>
                                        <div className="absolute -inset-x-3 -inset-y-1 -mx-2 -my-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                                    </Link>

                                    <Link href="/profile" className="flex items-center space-x-2 text-gray-400 hover:text-foreground relative group w-fit px-2 transition-colors">
                                        <UserIcon className="w-6 h-6 z-[2]" />
                                        <span className="hidden sm:inline z-[2]">Profile</span>
                                        <div className="absolute -inset-x-3 -inset-y-1 -mx-2 -my-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </nav>
                <div className="mt-auto">
                    {status === 'authenticated' ? (
                        <CustomPopover
                            placement='default'
                            offset={0}
                            className='bg-card rounded-2xl z-[10] border border-border shadow-2xl'
                            trigger={
                                <div className="flex items-center space-x-2 text-gray-400 hover:text-foreground relative group w-fit p-2 transition-colors cursor-pointer">
                                    <AlignJustifyIcon className="w-6 h-6 z-[2]" />
                                    <span className="hidden sm:inline z-[2]">More</span>
                                    <div className="absolute -inset-x-3 -inset-y-1 -mx-2 my-0 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                                </div>
                            }
                        >
                            <ExtraSettingsButton />
                        </CustomPopover>
                    ) : status === 'unauthenticated' ? (
                        <Link href="/login" className="flex items-center space-x-2 text-gray-400 hover:text-foreground relative group w-fit p-2 transition-colors">
                            <LogInIcon className="w-6 h-6 z-[2]" />
                            <span className="hidden sm:inline z-[2]">Login</span>
                            <div className="absolute -inset-x-3 -inset-y-1 -mx-2 my-0 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl bg-hover z-[1]"></div>
                        </Link>
                    ) : (
                        <Skeleton />
                    )}
                </div>
            </div>
        </div>
    );
}
