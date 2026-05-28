import Head from "next/head";
import Script from "next/script";

import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "../styles/globals.css";

export default function App({
  Component,
  pageProps,
}) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <meta
          name="theme-color"
          content="#111827"
        />

        <meta
          name="googlebot"
          content="index,follow,max-image-preview:large"
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      {/* Google Analytics */}

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="lazyOnload"
      />

      <Script
        id="google-analytics"
        strategy="lazyOnload"
      >
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            dataLayer.push(arguments);
          }

          gtag('js', new Date());

          gtag('config', 'G-YS8L61XLPR', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <Navbar />

      <Component {...pageProps} />

      <Footer />

      <SpeedInsights />
    </>
  );
}
