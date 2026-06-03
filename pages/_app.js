import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getProductsFast } from "../lib/firebaseQuery";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  /* ================= PRELOAD PRODUCTS (TURBO BOOST) ================= */
  useEffect(() => {
    getProductsFast(); // 🔥 preload in background (no blocking)
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <meta
          name="googlebot"
          content="index,follow,max-image-preview:large"
        />

        <meta name="theme-color" content="#111827" />

        <link rel="icon" href="/favicon.ico" />

        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
        />

        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />

        <link
          rel="dns-prefetch"
          href="https://www.googletagmanager.com"
        />

        <link
          rel="dns-prefetch"
          href="https://pagead2.googlesyndication.com"
        />
      </Head>

      {/* ================= GTM ================= */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});
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

      {/* ================= GA4 ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="lazyOnload"
      />

      <Script id="ga4-script" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag(){
            dataLayer.push(arguments);
          }

          gtag('js', new Date());

          gtag('config', 'G-YS8L61XLPR', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>

      {/* ================= FACEBOOK PIXEL ================= */}
      <Script id="facebook-pixel" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s)
          {
            if(f.fbq)return;
            n=f.fbq=function(){
              n.callMethod ?
              n.callMethod.apply(n,arguments) :
              n.queue.push(arguments)
            };
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(
            window,
            document,
            'script',
            'https://connect.facebook.net/en_US/fbevents.js'
          );

          fbq('init', '1038760229314882');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* ================= ADSENSE ================= */}
      <Script
        async
        strategy="lazyOnload"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
      />

      {/* ================= GTM NOSCRIPT ================= */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KNQM8KBN"
          height="0"
          width="0"
          style={{
            display: "none",
            visibility: "hidden",
          }}
        />
      </noscript>

      <Navbar />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />

      <SpeedInsights />
    </>
  );
              }
