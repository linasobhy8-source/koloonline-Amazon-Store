/** @type {import('next').NextConfig} */

const nextConfig = {

  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,


  // ================= IMAGES OPTIMIZATION =================

  images: {

    formats: [
      "image/avif",
      "image/webp",
    ],

    minimumCacheTTL: 31536000,

    dangerouslyAllowSVG: false,


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
        hostname: "images.amazon.com",
      },

      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },

      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },

    ],

  },


  // ================= REWRITES =================

  async rewrites() {

    return [];

  },


  // ================= REDIRECTS =================

  async redirects() {

    return [

      // Old store URL

      {
        source: "/store",

        destination: "/",

        permanent: true,

      },

    ];

  },


  // ================= HEADERS =================

  async headers() {

    return [

      {

        source: "/:path*",


        headers: [

          {

            key:
              "X-Content-Type-Options",

            value:
              "nosniff",

          },


          {

            key:
              "Referrer-Policy",

            value:
              "strict-origin-when-cross-origin",

          },


          {

            key:
              "Permissions-Policy",

            value:
              "camera=(), microphone=(), geolocation=()",

          },


          {

            key:
              "X-Frame-Options",

            value:
              "SAMEORIGIN",

          },


          {

            key:
              "X-DNS-Prefetch-Control",

            value:
              "on",

          },


        ],

      },



      // ================= SITEMAP CACHE =================

      {

        source:
          "/sitemap.xml",


        headers: [

          {

            key:
              "Content-Type",

            value:
              "application/xml",

          },


          {

            key:
              "Cache-Control",

            value:
              "public, s-maxage=3600, stale-while-revalidate=86400",

          },

        ],

      },



      // ================= NEXT STATIC CACHE =================

      {

        source:
          "/_next/static/:path*",


        headers: [

          {

            key:
              "Cache-Control",

            value:
              "public, max-age=31536000, immutable",

          },

        ],

      },

    ];

  },


  // ================= PERFORMANCE =================

  experimental: {

    optimizePackageImports: [

      "firebase",

    ],

  },


};


module.exports = nextConfig;
