/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { URL: process.env.NEXT_PUBLIC_URL },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://uvnjlj11ei.execute-api.us-east-1.amazonaws.com/dev//api/:path*`, // Adjust the target URL as needed
        // destination: 'http://localhost:5000/api/:path*', // Adjust the target URL as needed
      },
    ];
  },
  async headers() {
    return [
      {
        // Add a WebSocket upgrade rule
        source: '/:path*',
        headers: [
          {
            key: 'Upgrade',
            value: 'websocket',
          },
          {
            key: 'Connection',
            value: 'Upgrade',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
