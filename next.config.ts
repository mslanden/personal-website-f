/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy API requests to the Flask backend
  async rewrites() {
    return [
      {
        source: "/query",
        destination: "http://localhost:5000/query",
      },
    ];
  },
};

module.exports = nextConfig;
