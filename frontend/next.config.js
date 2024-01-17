/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { URL: process.env.URL },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Adjust the target URL as needed
      },
    ];
  },
};

module.exports = nextConfig;
