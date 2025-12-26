import {NextConfig} from 'next';

const nextConfig: NextConfig = {
    cacheComponents: true,
    images: {
        // This is necessary to display images from your local Vendure instance
        dangerouslyAllowLocalIP: true,
        remotePatterns: [
            {
                hostname: 'readonlydemo.vendure.io',
            },
            {
                hostname: 'demo.vendure.io'
            },
            {
                hostname: 'localhost'
            },
            {
                protocol: 'https',
                hostname: '*.up.railway.app', // Libera qualquer backend do Railway
            },
        ],
    },
    experimental: {
        rootParams: true
    }
};

export default nextConfig;