"use client"

import toggleFollow, { isFollowing } from "@/actions/(users)/follow.action";
import { useEffect, useState } from "react";
import { toast } from 'sonner';

export default function FollowUserButton({ userId, session_id }: { userId: string; session_id: string }) {
    const [isFollowingUser, setIsFollowing] = useState(false);

    useEffect(() => {
        if (!session_id) return;
        if (session_id === userId) return;

        const checkFollowing = async () => {
            const follow = await isFollowing({ followerId: session_id, followedId: userId }) as any;

            if (follow?.error) {
                toast.error(follow.error);
                return;
            }

            setIsFollowing(!!follow);
        };

        checkFollowing();
    }, [session_id, userId]);

    const handleFollow = async () => {
        if (!session_id) return;
        if (session_id === userId) return;

        const tf = await toggleFollow({ followerId: session_id, followedId: userId });

        if (tf?.error) {
            toast.error(tf.error);
            return;
        }

        setIsFollowing((prev) => !prev);
    };

    return (
        <button className={`w-full bg-white border-white border-2 text-black rounded-xl py-1.5 h-fit disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={session_id ? session_id === userId : true}
            onClick={handleFollow}
        >
            {isFollowingUser ? 'Unfollow' : 'Follow'}
        </button>
    );
}