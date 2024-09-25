/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/docs/:path*',
                destination: 'https://tiancailuoxiaohei.notion.site/dfd73a088f7745d39244bbcecbbaf910?v=bdb40b603e3e4a379cf3f10b8caee4c5&pvs=4',
            },
        ];
    },
};

export default nextConfig;
