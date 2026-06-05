/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false, // 🔥 يقلل re-render

  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache

    deviceSizes: [320, 420, 768, 1024, 1200],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "**firebaseapp.com",
      },
      {
        protocol: "https",
        hostname: "**googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

module.exports = nextConfig;
