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

        <link rel="icon" href="/favicon.ico" />

        {/* SEO SAFE DEFAULTS */}
        <meta name="googlebot" content="index,follow" />
      </Head>

      {/* ================= GOOGLE ANALYTICS ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('js', new Date());

          gtag('config', 'G-YS8L61XLPR', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

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
