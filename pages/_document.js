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

        {/* ================= ADSENSE ================= */}
        {/* مهم: لازم pub-cid مش pub-id */}
        <meta
          name="google-adsense-account"
          content="ca-pub-1294940976431468"
        />

        {/* ================= ADSENSE SCRIPT ================= */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
          crossOrigin="anonymous"
        />

        {/* ================= STRUCTURED DATA ================= */}
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

        {/* ================= SPEED BOOST ================= */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
    }
