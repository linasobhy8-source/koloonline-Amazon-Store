/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true, // 🔥 مهم لكشف أخطاء React اللي عندك (زي #130)

  compress: true,
  poweredByHeader: false,

  productionBrowserSourceMaps: false,

  // 🔥 أفضل للأداء + تقليل bundle size
  swcMinify: true,

  images: {
    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60 * 60 * 24 * 30,

    deviceSizes: [320, 420, 640, 768, 1024, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

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

    // 🔥 تحسين مهم في Next 15 (بيقلل مشاكل build عند static generation)
    serverComponentsExternalPackages: ["firebase"],
  },
};

export default nextConfig;
