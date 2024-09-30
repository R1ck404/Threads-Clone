"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import registerUser from '@/actions/(authentication)/register.action';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const isPasswordSecure = (password: string) => {
    const secureLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    return secureLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
}

const Register = () => {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (session && status === 'authenticated') {
            router.push('/');
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!isPasswordSecure(password)) {
            toast.error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            return;
        }

        const response = await registerUser({ username, email, password });

        if (response.error) {
            toast.error(response.error);
            return;
        }

        toast.success('Account created successfully', {
            description: 'Please sign in to continue',
        });
        router.push('/login');
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
                            Username
                        </label>
                        <input
                            type="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 py-1.5 px-3 w-full rounded-md"
                            required
                        />
                    </div>
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

                    <div className='space-y-1'>
                        <label className='text-sm font-medium text-foreground'>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 py-1.5 px-3 w-full rounded-md"
                            required
                        />
                    </div>

                    <button className="w-full rounded-md bg-white text-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium shadow !mt-6" type="submit">
                        Register
                    </button>
                    <p className='text-center text-sm text-zinc-500'>
                        Already have an account?
                        <Link href="/login" className='font-medium text-foreground underline-offset-4 outline-none hover:underline decoration-zinc-300 focus-visible:underline ml-1'>
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </div>

    );
};

export default Register;