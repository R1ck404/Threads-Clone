"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { signIn, useSession } from "next-auth/react"
import Link from 'next/link';
import { toast } from 'sonner';

const Login = () => {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        console.log(session, status);
        if (session && status === 'authenticated') {
            router.push('/');
        }
    }, [session]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await signIn('credentials', { email, password, redirectTo: '/' }).catch((e) => {
            toast.error('Invalid email or password');
        }).then(() => {
            toast.success('Logged in successfully');
            router.push('/');
        });
    };

    return (
        <div className="flex items-center justify-center h-full w-full min-h-screen bg-background text-foreground">
            <form className="rounded-2xl border border-border bg-card px-8 py-10 shadow-md space-y-6 w-96" onSubmit={handleSubmit}>
                <header className="flex flex-col items-center text-center">
                    <div className="rounded-full bg-neutral-800 border border-neutral-700 size-12"></div>
                    <h1 className='mt-4 text-xl font-medium tracking-tight text-foreground'>
                        Sign in to your account
                    </h1>
                </header>

                <div className="space-y-4">
                    <div className='space-y-1'>
                        <label className='text-sm font-medium text-foreground'>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 py-1.5 px-3 w-full rounded-md"
                            required
                        />
                    </div>

                    <div className='space-y-1'>
                        <label className='text-sm font-medium text-foreground'>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 py-1.5 px-3 w-full rounded-md"
                            required
                        />
                    </div>
                    <button className="w-full rounded-md bg-white text-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium shadow !mt-6" type="submit">
                        Sign in
                    </button>
                    <p className='text-center text-sm text-zinc-500'>
                        No account?
                        <Link href="/register" className='font-medium text-foreground underline-offset-4 outline-none hover:underline decoration-zinc-300 focus-visible:underline ml-1'>
                            Create an account
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
