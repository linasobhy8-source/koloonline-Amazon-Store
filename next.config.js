/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  /* ================= IMAGE OPTIMIZATION ================= */
  images: {
    domains: [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      "via.placeholder.com",
      "firebasestorage.googleapis.com",
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  /* ================= PERFORMANCE ================= */
  productionBrowserSourceMaps: false,

  /* ================= ROUTING ================= */
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/product/:path*",
        destination: "/products/:path*",
        permanent: true,
      },
    ];
  },

  /* ================= HEADERS (CACHE BOOST) ================= */
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
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
