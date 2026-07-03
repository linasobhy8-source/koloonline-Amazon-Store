import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>

        {/* ================= BASIC SEO ================= */}
        <meta charSet="UTF-8" />

        {/* مهم: نخلي الافتراضي index بس بدون spam signals */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-image-preview:large" />

        <meta name="theme-color" content="#ff9900" />

        {/* ================= CANONICAL DOMAIN SIGNAL ================= */}
        <link rel="canonical" href="https://www.koloonline.online" />

        {/* ================= SITEMAP ================= */}
        <link
          rel="sitemap"
          type="application/xml"
          href="https://www.koloonline.online/sitemap.xml"
        />

        {/* ================= PERFORMANCE ================= */}
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* ================= ADSENSE ================= */}
        <meta name="google-adsense-account" content="ca-pub-1294940976431468" />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
          crossOrigin="anonymous"
        />

        {/* ================= WEBSITE SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Koloonline",
              url: "https://www.koloonline.online",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.koloonline.online/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* ================= ORGANIZATION SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Koloonline",
              url: "https://www.koloonline.online",
              logo: "https://www.koloonline.online/logo.png",
            }),
          }}
        />

        {/* ================= OPEN GRAPH ================= */}
        <meta property="og:site_name" content="Koloonline" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.koloonline.online" />
        <meta
          property="og:title"
          content="Koloonline - Amazon Deals & Trending Products"
        />
        <meta
          property="og:description"
          content="Discover trending Amazon products, reviews and deals."
        />

        {/* ================= TWITTER ================= */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Koloonline - Amazon Deals & Trending Products"
        />
        <meta
          name="twitter:description"
          content="Discover trending Amazon products and daily deals."
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
    }
