/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.twimg.com' },
      { protocol: 'https', hostname: '**.wp.com' },
      { protocol: 'https', hostname: '**.medium.com' },
      { protocol: 'https', hostname: '**.substack.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
