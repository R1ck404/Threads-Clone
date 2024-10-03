/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        ALLOW_IMAGES: process.env.NEXT_PUBLIC_ALLOW_IMAGES,
    },
};

export default nextConfig;
