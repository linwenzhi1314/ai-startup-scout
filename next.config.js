/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/extension/:path*',
        destination: '/extension/:path*',
      },
    ];
  },
  async redirects() {
    return [
      // zh-Hans 重定向到根路径
      {
        source: '/zh-Hans',
        destination: '/',
        permanent: false, // 302 重定向（临时）
      },
      {
        source: '/zh-Hans/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;