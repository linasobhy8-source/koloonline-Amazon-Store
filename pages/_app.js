import Head from "next/head";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* ================= GLOBAL HEAD ================= */}
      <Head>
        <meta charSet="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <meta name="theme-color" content="#111827" />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <meta name="googlebot" content="index,follow" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ================= GOOGLE TAG MANAGER (GTM) ================= */}
      <Script
        id="gtm-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KNQM8KBN');
          `,
        }}
      />

      {/* ================= GOOGLE ANALYTICS 4 ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="afterInteractive"
      />

      <Script id="ga4-script" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('js', new Date());

          gtag('config', 'G-YS8L61XLPR', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* ================= GTM NOSCRIPT (fallback) ================= */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KNQM8KBN"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {/* ================= LAYOUT ================= */}
      <Navbar />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />

      {/* ================= PERFORMANCE ================= */}
      <SpeedInsights />
    </>
  );
            }
