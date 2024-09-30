"use client"

import { signOut } from "next-auth/react";

export default function LogoutButton({ className }: { className?: string }) {
    return (
        <button
            onClick={() => {
                signOut({
                    callbackUrl: "/",
                });
            }}
            className={className}
        >
            Logout
        </button>
    )
}