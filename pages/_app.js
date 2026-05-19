import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/react";

/* ================= GLOBAL APP ================= */
export default function App({ Component, pageProps }) {
  const router = useRouter();

  /* ================= GA4 SPA TRACK (OPTIMIZED) ================= */
  useEffect(() => {
    const handleRouteChange = (url) => {
      requestIdleCallback(() => {
        if (typeof window.gtag !== "undefined") {
          window.gtag("config", "G-YS8L61XLPR", {
            page_path: url,
          });
        }
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <>
      {/* ================= SEO (STATIC ONLY) ================= */}
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="description"
          content="Koloonline Amazon Affiliate Store - Best Deals Daily Updated"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://koloonline.online" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ================= GA4 (NON BLOCKING) ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="lazyOnload"
      />

      <Script id="ga4" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YS8L61XLPR', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* ================= FACEBOOK PIXEL (DEFERRED) ================= */}
      <Script id="fb-pixel" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '353894198840203');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* ================= ADSENSE (SAFE LOAD) ================= */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />

      {/* ================= SPEED INSIGHTS (NO BLOCKING) ================= */}
      <SpeedInsights />

      {/* ================= APP ================= */}
      <Component {...pageProps} />
    </>
  );
        }
