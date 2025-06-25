/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://13.238.227.125:3000/:path*' // 백엔드 서버 주소
            }
        ]
    },
    images: {
        domains: ['localhost']
    },
    reactStrictMode: false,
}

module.exports = nextConfig 