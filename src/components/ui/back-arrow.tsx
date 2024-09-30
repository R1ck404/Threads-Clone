"use client"

import { ArrowLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackArrow() {
    const router = useRouter();
    return (
        <button onClick={() => {
            router.back();
        }} className="relative group">
            <ArrowLeftCircle size={24} className="text-neutral-600 z-[2] relative" />
            <div className="absolute -inset-x-2 -inset-y-2 scale-90 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-full bg-hover z-[1]"></div>
        </button>
    )
}