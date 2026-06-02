/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  /* ================= PERFORMANCE ================= */
  compress: true,
  poweredByHeader: false,

  /* ================= IMAGE OPTIMIZATION ================= */
  images: {
    remotePatterns: [
      // Amazon Images (الأهم)
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.amazon.*",
      },

      // Firebase / Google images
      {
        protocol: "https",
        hostname: "**firebaseapp.com",
      },
      {
        protocol: "https",
        hostname: "**googleusercontent.com",
      },

      // fallback images
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],

    /* ================= MODERN FORMATS ================= */
    formats: ["image/avif", "image/webp"],

    /* ================= CACHE SPEED ================= */
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days cache

    /* ================= DEVICE OPTIMIZATION ================= */
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750],
  },

  /* ================= OPTIONAL HEADERS (SEO + ADSENSE SAFE) ================= */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
