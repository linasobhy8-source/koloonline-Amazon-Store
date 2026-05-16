const nextConfig = {
  /* ================= IMAGES ================= */
  images: {
    domains: [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
    ],
  },

  /* ================= GLOBAL SEO SETTINGS ================= */
  trailingSlash: false,

  /* ================= REWRITES ================= */
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },

  /* ================= REDIRECTS (SEO FIX FULL DOMAIN CONTROL) ================= */
  async redirects() {
    return [
      /* ================= FIX BROKEN SLUG ================= */
      {
        source: "/blog/%7Bslug%7D",
        destination: "/blog",
        permanent: true,
      },

      /* ================= FIX OLD PRODUCT ROUTE ================= */
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },

      /* ================= OLD STORE ================= */
      {
        source: "/store",
        destination: "/",
        permanent: true,
      },

      /* ================= FORCE HTTPS ================= */
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://koloonline.online/:path*",
        permanent: true,
      },

      /* ================= FORCE NON-WWW ================= */
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.koloonline.online",
          },
        ],
        destination: "https://koloonline.online/:path*",
        permanent: true,
      },
    ];
  },

  /* ================= HEADERS ================= */
  async headers() {
    return [
      /* ================= SITEMAP CACHE ================= */
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

      /* ================= GLOBAL SECURITY HEADERS ================= */
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

  /* ================= PERFORMANCE ================= */
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
