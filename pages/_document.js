import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>

        {/* ================= ADSENSE GLOBAL ================= */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        ></script>

        {/* ================= SEO GLOBAL ================= */}
        <meta name="google-site-verification" content="PUT-YOUR-CODE-HERE" />

      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
