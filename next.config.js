const nextConfig = {
  /* ================= IMAGES ================= */
  images: {
    domains: [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
    ],
  },

  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  /* ================= REWRITES ================= */
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },

  /* ================= REDIRECTS (SEO CLEANUP) ================= */
  async redirects() {
    return [
      // ❌ broken blog template
      {
        source: "/blog/%7Bslug%7D",
        destination: "/blog",
        permanent: true,
      },

      // ❌ empty product route
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },

      // ❌ old store page
      {
        source: "/store",
        destination: "/",
        permanent: true,
      },

      // ❌ fake search URL (important for Google cleanup)
      {
        source: "/search",
        destination: "/",
        permanent: true,
      },

      // ❌ fiverr page (not existing)
      {
        source: "/fiverr-services",
        destination: "/",
        permanent: true,
      },
    ];
  },

  /* ================= HEADERS ================= */
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, stale-while-revalidate=86400",
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
