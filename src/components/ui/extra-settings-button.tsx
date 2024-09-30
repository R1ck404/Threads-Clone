'use client';

import React, { useEffect, useState } from 'react';
import { TransitionPanel } from '@/components/ui/transition-panel';
import useMeasure from 'react-use-measure';
import LogoutButton from './logout-button';
import { ArrowLeftIcon, ArrowRightIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ExtraSettingsButton() {
    const { theme, setTheme } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [ref, bounds] = useMeasure();

    const renderThemeOption = (value: string, icon: React.ReactNode) => (
        <div
            className={`cursor-pointer flex items-center justify-center px-3 py-2.5 w-full ${theme === value ? 'outline outline-border outline-1 bg-card rounded-lg' : ''
                }`}
            onClick={() => setTheme(value)}
        >
            {icon}
        </div>
    );

    const PANELS = [
        {
            title: 'Home',
            content: (
                <div className="flex flex-col min-w-[12rem] space-y-0.5 p-1">
                    <button
                        className="px-4 py-3 transition-colors hover:bg-hover rounded-xl w-full flex justify-between items-center"
                        onClick={() => handleSetActiveIndex(1)}
                    >
                        <span>Appearance</span>

                        <ArrowRightIcon className="size-4" />
                    </button>
                    <hr className="border-border w-full !my-1" />
                    <LogoutButton className="px-4 py-3 transition-colors hover:bg-hover rounded-xl text-left" />
                </div>
            ),
        },
        {
            title: 'Appearance',
            content: (
                <div className="flex flex-col w-[15rem] h-full p-2">
                    <div className="flex justify-between items-center">
                        <ArrowLeftIcon className="cursor-pointer" onClick={() => handleSetActiveIndex(0)} />
                        <h1 className="text-sm font-semibold">Appearance</h1>
                        <div className="w-5 h-5" />
                    </div>

                    <div className="flex rounded-xl bg-background mt-auto space-x-2">
                        {renderThemeOption('light', <SunIcon className="size-4" />)}
                        {renderThemeOption('dark', <MoonIcon className="size-4" />)}
                        {renderThemeOption('system', <span className="text-sm font-semibold text-zinc-600">Auto</span>)}
                    </div>
                </div>
            ),
        },
    ];

    const handleSetActiveIndex = (newIndex: number) => {
        setDirection(newIndex > activeIndex ? 1 : -1);
        setActiveIndex(newIndex);
    };


    useEffect(() => {
        if (activeIndex < 0) setActiveIndex(0);
        if (activeIndex >= PANELS.length) setActiveIndex(PANELS.length - 1);
    }, [activeIndex]);

    return (
        <div className="w-[15rem] h-fit overflow-hidden rounded-xl border border-border bg-card">
            <TransitionPanel
                activeIndex={activeIndex}
                variants={{
                    enter: (direction) => ({
                        x: direction > 0 ? 240 : -240,
                        opacity: 0,
                        height: bounds.height,
                        position: 'initial',
                    }),
                    center: {
                        zIndex: 1,
                        x: 0,
                        opacity: 1,
                        height: '115px',
                    },
                    exit: (direction) => ({
                        zIndex: 0,
                        x: direction < 0 ? 240 : -240,
                        opacity: 0,
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                    }),
                }}
                transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                }}
                custom={direction}
            >
                {PANELS.map((panel, index) => (
                    <div key={index} ref={ref} className="w-full h-full">
                        {panel.content}
                    </div>
                ))}
            </TransitionPanel>
        </div>
    );
}
