/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.firebaseapp.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },

  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
