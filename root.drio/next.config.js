/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },

  env: {
    API_URL: process.env.API_URL,
    MOCK_URL: process.env.MOCK_URL,
    WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    DEVELOPMENT_MODE: process.env.DEVELOPMENT_MODE,
    WEBSOCKET_USERNAME: process.env.WEBSOCKET_USERNAME,
    WEBSOCKET_PASSWORD: process.env.WEBSOCKET_PASSWORD,
    RECONNECT_INTERVAL: process.env.RECONNECT_INTERVAL,
    HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
