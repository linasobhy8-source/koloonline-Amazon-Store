import Head from "next/head";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  /* ================= PRELOAD (NON-BLOCKING) ================= */
  useEffect(() => {
    // يمنع أي blocking
    if (typeof window !== "undefined") {
      requestIdleCallback(() => {
        console.log("App ready");
      });
    }
  }, []);

  return (
    <>
      {/* ================= SEO BASE ================= */}
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="googlebot" content="index,follow,max-image-preview:large" />
        <meta name="theme-color" content="#111827" />
        <link rel="icon" href="/favicon.ico" />

        {/* ================= PERFORMANCE HINTS ================= */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </Head>

      {/* ================= GTM (DEFERRED) ================= */}
      <Script
        id="gtm-script"
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

      {/* ================= GA4 (DELAYED) ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="lazyOnload"
      />

      <Script id="ga4-script" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-YS8L61XLPR', {
            anonymize_ip: true,
            send_page_view: false
          });

          window.addEventListener('load', () => {
            gtag('event', 'page_view');
          });
        `}
      </Script>

      {/* ================= FACEBOOK PIXEL (LAZY) ================= */}
      <Script id="facebook-pixel" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;
            n=f.fbq=function(){
              n.callMethod ?
              n.callMethod.apply(n,arguments) :
              n.queue.push(arguments)
            };
            if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '1038760229314882');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* ================= ADSENSE (LAZY ONLY) ================= */}
      <Script
        async
        strategy="lazyOnload"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
      />

      {/* ================= LAYOUT ================= */}
      <Navbar />

      <main style={{ minHeight: "80vh" }}>
        <Component {...pageProps} />
      </main>

      <Footer />

      <SpeedInsights />
    </>
  );
    }
