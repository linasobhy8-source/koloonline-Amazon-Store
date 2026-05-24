/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  trailingSlash: false,

  swcMinify: true,

  productionBrowserSourceMaps: false,

  /* ================= PERFORMANCE ================= */
  experimental: {
    optimizePackageImports: [
      "firebase",
    ],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production",
  },

  /* ================= IMAGES ================= */
  images: {
    unoptimized: false,

    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60 * 60 * 24 * 30,

    domains: [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      "images.unsplash.com",
      "via.placeholder.com",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  /* ================= REWRITES ================= */
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },

      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },

  /* ================= REDIRECTS ================= */
  async redirects() {
    return [
      /* ===== BAD BLOG URL ===== */
      {
        source: "/blog/%7Bslug%7D",
        destination: "/blog",
        permanent: true,
      },

      /* ===== EMPTY PRODUCT ===== */
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },

      /* ===== OLD STORE ===== */
      {
        source: "/store",
        destination: "/",
        permanent: true,
      },

      /* ===== BAD SEARCH ===== */
      {
        source: "/search",
        destination: "/",
        permanent: true,
      },

      /* ===== OLD FIVERR ===== */
      {
        source: "/fiverr-services",
        destination: "/fiverr",
        permanent: true,
      },

      /* ===== OLD BLOG ===== */
      {
        source: "/posts/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },
    ];
  },

  /* ================= HEADERS ================= */
  async headers() {
    return [
      /* ===== STATIC CACHE ===== */
      {
        source:
          "/:all*(svg|jpg|jpeg|png|webp|avif|gif
