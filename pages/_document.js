import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>

        {/* ================= BASIC SEO ================= */}
        <meta charSet="UTF-8" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="googlebot" content="index,follow" />
        <meta name="theme-color" content="#ff9900" />

        {/* ================= DNS PREFETCH ================= */}
        <link
          rel="dns-prefetch"
          href="//pagead2.googlesyndication.com"
        />
        <link
          rel="dns-prefetch"
          href="//www.google-analytics.com"
        />
        <link
          rel="dns-prefetch"
          href="//www.googletagmanager.com"
        />

        {/* ================= PRECONNECT ================= */}
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
        />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />

        {/* ================= ADSENSE ================= */}
        <meta
          name="google-adsense-account"
          content="ca-pub-1294940976431468"
        />

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

        {/* ================= ORGANIZATION SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Koloonline",
              url: "https://koloonline.online",
              logo: "https://koloonline.online/logo.png",
            }),
          }}
        />

      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
            }
