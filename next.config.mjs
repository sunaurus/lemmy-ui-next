/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: [
            // 'image/avif', //disabled because the conversion is seriously slow
            'image/webp',
        ],
        remotePatterns: [{protocol: 'https', hostname: '**'}]
    }
};

export default nextConfig;
