/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'techcrunch.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.vox-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.arstechnica.net',
      },
      {
        protocol: 'https',
        hostname: 'media.wired.com',
      },
      {
        protocol: 'https',
        hostname: 'venturebeat.com',
      },
      {
        protocol: 'https',
        hostname: 'wp.technologyreview.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
