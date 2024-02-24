/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },

  env: {
    API_URL: process.env.API_URL,
    MOCK_URL: process.env.MOCK_URL,
    DEVELOPMENT_MODE: process.env.DEVELOPMENT_MODE,
  },
};

module.exports = nextConfig;
