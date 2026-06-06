/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  compress: true,

  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 31536000, // سنة كاملة

    deviceSizes: [
      320,
      420,
      640,
      768,
      1024,
      1200,
      1600,
    ],

    imageSizes: [
      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],

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
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.firebaseapp.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },

  experimental: {
    optimizePackageImports: [
      "firebase",
      "@vercel/speed-insights",
    ],
  },
};

module.exports = nextConfig;
