/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  /* ================= PERFORMANCE ================= */
  compress: true,
  poweredByHeader: false,

  /* ================= IMAGE OPTIMIZATION ================= */
  images: {
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

    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60 * 60 * 24 * 7,

    deviceSizes: [320, 420, 768, 1024, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828],
  },

  /* ================= HEADERS ================= */
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
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
