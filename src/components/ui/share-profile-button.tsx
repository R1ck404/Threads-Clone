'use client'

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ShareProfileButton({ username }: { username?: string | null }) {
    const [link, setLink] = useState<string>('');

    useEffect(() => {
        const currentUrl = window.location.href;

        if (username) {
            const result = username ? currentUrl.replace('profile', '@' + username) : currentUrl;
            setLink(result);
        } else {
            setLink(currentUrl);
        }
    }, [username]);

    return (
        <button className='border-border border-2 w-full  rounded-xl py-1.5 h-fit' onClick={() => {
            navigator.clipboard.writeText(link);
            toast.success('Copied to clipboard');
        }}>
            Share
        </button>
    )
}