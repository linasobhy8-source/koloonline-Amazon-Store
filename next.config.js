/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  /* ================= PERFORMANCE ================= */
  compress: true,
  poweredByHeader: false,
  swcMinify: true,

  /* ================= IMAGE OPTIMIZATION (AMAZON + GLOBAL FIXED) ================= */
  images: {
    remotePatterns: [
      /* ================= AMAZON OFFICIAL ================= */
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },

      /* ================= AMAZON GLOBAL DOMAINS ================= */
      {
        protocol: "https",
        hostname: "**.amazon.com",
      },
      {
        protocol: "https",
        hostname: "**.amazon.ae",
      },
      {
        protocol: "https",
        hostname: "**.amazon.co.uk",
      },
      {
        protocol: "https",
        hostname: "**.amazon.de",
      },
      {
        protocol: "https",
        hostname: "**.amazon.fr",
      },
      {
        protocol: "https",
        hostname: "**.amazon.in",
      },

      /* ================= FIREBASE / GOOGLE CDN ================= */
      {
        protocol: "https",
        hostname: "**firebaseapp.com",
      },
      {
        protocol: "https",
        hostname: "**googleusercontent.com",
      },

      /* ================= FALLBACK IMAGES ================= */
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],

    /* ================= MODERN FORMATS ================= */
    formats: ["image/avif", "image/webp"],

    /* ================= SPEED CACHE (IMPORTANT BOOST) ================= */
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache (أسرع بكتير)

    /* ================= RESPONSIVE OPTIMIZATION ================= */
    deviceSizes: [320, 420, 768, 1024, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384,
