import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights";

/* ================= V6 REVENUE STATE ================= */
const revenueState = {
  trafficIntent: "unknown",
};

/* ================= REVENUE ENGINE ================= */
function useRevenueOS() {
  const initialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const path = window.location.pathname;

    revenueState.trafficIntent = path.includes("/product/")
      ? "high_intent"
      : path.includes("/blog/")
      ? "medium_intent"
      : "low_intent";

    const fireSignal = () => {
      if (window.__REVENUE_OS_ACTIVE__) return;
      window.__REVENUE_OS_ACTIVE__ = true;

      requestIdleCallback(() => {
        window.gtag?.("event", "revenue_intent", {
          intent: revenueState.trafficIntent,
          page: path,
        });

        window.fbq?.("trackCustom", "RevenueIntent", {
          intent: revenueState.trafficIntent,
        });
      });
    };

    const handler = () => fireSignal();

    ["scroll", "click", "touchstart"].forEach((e) =>
      window.addEventListener(e, handler, { passive: true })
    );

    return () => {
      ["scroll", "click", "touchstart"].forEach((e) =>
        window.removeEventListener(e, handler)
      );
    };
  }, []);

  useEffect(() => {
    const handleRoute = (url) => {
      requestIdleCallback(() => {
        window.gtag?.("config", "G-YS8L61XLPR", {
          page_path: url,
        });
      });
    };

    router.events.on("routeChangeComplete", handleRoute);
    return () => router.events.off("routeChangeComplete", handleRoute);
  }, [router.events]);
}

/* ================= APP ================= */
export default function App({ Component, pageProps }) {
  useRevenueOS();

  return (
    <>
      {/* SEO */}
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* GA4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="afterInteractive"
      />

      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', 'G-YS8L61XLPR', { send_page_view: false });
        `}
      </Script>

      {/* Facebook Pixel */}
      <Script id="fb" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '353894198840203');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* ADS */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />

      {/* ✅ SPEED INSIGHTS (FIXED) */}
      <SpeedInsights />

      <Component {...pageProps} />
    </>
  );
          }
