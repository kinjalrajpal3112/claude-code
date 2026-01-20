/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  // Disable SWC if binary fails to load (fallback to Babel)
  swcMinify: true,
  // Alternative: force use of Babel instead of SWC if SWC fails
  // experimental: {
  //   forceSwcTransforms: false,
  // },
};

module.exports = nextConfig;
