import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ================= BASIC SEO ================= */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />

        {/* ================= THEME ================= */}
        <meta name="theme-color" content="#ff9900" />

        {/* ================= PERFORMANCE BOOST (DNS PREFETCH) ================= */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ================= PRECONNECT (CRITICAL) ================= */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="" />

        {/* ================= ADSENSE ================= */}
        <meta
          name="google-adsense-account"
          content="ca-pub-1294940976431468"
        />

        {/* ================= ADSENSE SCRIPT (DEFER OPTIMIZED) ================= */}
        <script
          async
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
          crossOrigin="anonymous"
        />

        {/* ================= STRUCTURED DATA (SEO BOOST) ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Koloonline",
              url: "https://koloonline.online",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://koloonline.online/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* ================= CRITICAL CSS HINT ================= */}
        <link rel="preload" as="style" href="/styles/globals.css" />

        {/* ================= FAVICON (OPTIONAL BOOST) ================= */}
        <link rel="icon" href="/favicon.ico" />

      </Head>

      <body>
        {/* ================= MAIN APP ================= */}
        <Main />

        {/* ================= NEXT SCRIPTS ================= */}
        <NextScript />
      </body>
    </Html>
  );
    }
