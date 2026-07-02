/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // ================= IMAGES =================
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,

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

  // ================= ROUTES =================
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },

  // ================= SEO + SECURITY HEADERS =================
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
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

      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ================= OPTIONAL (SEO FIX IMPORTANT) =================
  async redirects() {
    return [
      // توحيد الدومين (مهم جدًا SEO)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "koloonline.online",
          },
        ],
        destination: "https://www.koloonline.online/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
