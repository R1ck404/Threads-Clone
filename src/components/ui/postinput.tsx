"use client";

import React, { useEffect, useRef, useState } from "react";
import { Paperclip, XIcon } from "lucide-react";
import createPost from "@/actions/(posts)/create_post.action";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from 'sonner';

interface PostInputProps {
    session_id: string;
    username: string;
}

export default function PostInput({ session_id, username }: PostInputProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        const objectUrls = imageFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(objectUrls);

        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imageFiles]);

    const createPostAction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!session) {
            toast.error("You must be logged in to do this.");
            return;
        }

        const input = inputRef.current;
        const formData = new FormData();

        if (input) {
            formData.append("content", input.value || "");
        }

        imageFiles.forEach((file, idx) => {
            formData.append("image_" + idx, file, file.name);
        });

        const uploadResponse = await fetch('/api/upload_images', {
            method: 'POST',
            body: formData,
        });

        const { urls: imageUrls } = await uploadResponse.json();

        await createPost({
            content: input?.value || '',
            authorId: session_id,
            images: imageUrls,
        });

        if (input) input.value = '';
        setImageFiles([]);
        setImagePreviews([]);

        toast.success("Post created successfully!");

        router.refresh();
    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const selectedFiles = Array.from(files);
            setImageFiles(files => [...files, ...selectedFiles]);
        }
    };

    return (
        <div className="px-4 pt-4">
            <form className="flex items-center space-x-3 mb-3 w-full" onSubmit={createPostAction}>
                <img src={session?.user?.avatarUrl || "/placeholder-image.jpg?height=40&width=40&text=user"} alt="User" className="size-10 rounded-full"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40&";
                    }} />
                <div className="">
                    <p className="font-semibold">{username}</p>
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="bg-transparent text-sm text-zinc-600 placeholder:text-zinc-600 p-0 w-full rounded"
                        ref={inputRef}
                    />
                </div>
                <button className="text-blue-500 !ml-auto" type="submit">Post</button>
            </form>
            <div className="flex items-center justify-between pl-[3.25rem] text-zinc-600">
                <label className="flex items-center cursor-pointer">
                    <Paperclip className="w-4 h-4" />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleImageChange}
                    />
                </label>
                <p className="text-sm">Anyone can reply</p>
            </div>
            {imagePreviews.length > 0 && (
                <div className="mt-2 flex gap-2 px-[3.25rem]">
                    {imagePreviews.map((preview, index) => (
                        <div className="relative group max-w-24 overflow-hidden rounded-md">
                            <div className="absolute top-0 left-0 w-full max-w-24 h-full bg-opacity-0 group-hover:bg-opacity-50 bg-black transition-all opacity-0 group-hover:opacity-100">
                                <button
                                    className="absolute top-1 right-1 rounded-full p-1 bg-skeleton"
                                    onClick={() => {
                                        setImageFiles(files => files.filter((_, i) => i !== index));
                                    }}
                                >
                                    <XIcon className="w-4 h-4 text-foreground" />
                                </button>
                            </div>
                            <img key={index} src={preview} alt={`Image Preview ${index + 1}`} className="max-w-24 aspect-auto rounded-md" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
