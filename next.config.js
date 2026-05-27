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

  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

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
};

module.exports = nextConfig;
