import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ================= SEO DEFAULT ================= */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* مهم جدًا للفهرسة */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        {/* تحسين الـ crawl */}
        <meta name="theme-color" content="#ff9900" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
    }
