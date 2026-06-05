import Head from "next/head";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* ================= BASIC META ================= */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <meta name="theme-color" content="#111827" />
      </Head>

      {/* ================= GTM OPTIMIZED ================= */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KNQM8KBN');
          `,
        }}
      />

      <Navbar />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />

      {/* Vercel analytics (keep light) */}
      <SpeedInsights />
    </>
  );
          }
