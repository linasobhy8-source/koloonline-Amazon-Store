/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      "via.placeholder.com",
      "firebasestorage.googleapis.com",
    ],
  },

  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

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
        source: "/blog/:slug",
        destination: "/blog",
        permanent: true,
      },

      {
        source: "/product/:path*",
        destination: "/products/:path*",
        permanent: true,
      },

      {
        source: "/store",
        destination: "/",
        permanent: true,
      },

      {
        source: "/search",
        destination: "/",
        permanent: true,
      },

      {
        source: "/fiverr-services",
        destination: "/",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
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
