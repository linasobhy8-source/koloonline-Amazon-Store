import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/react";

/* ================= V6 REVENUE STATE ================= */
const revenueState = {
  productPerformance: {},
  pageRevenueScore: {},
  trafficIntent: "unknown",
};

/* ================= V6 REVENUE ENGINE ================= */
function useRevenueOS(router) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const path = window.location.pathname;

    /* ================= INTENT DETECTION ================= */
    if (path.includes("/product/")) {
      revenueState.trafficIntent = "high_intent";
    } else if (path.includes("/blog/")) {
      revenueState.trafficIntent = "medium_intent";
    } else {
      revenueState.trafficIntent = "low_intent";
    }

    /* ================= REVENUE TRACKING ================= */
    const trackRevenueSignal = () => {
      if (window.__REVENUE_OS_ACTIVE__) return;
      window.__REVENUE_OS_ACTIVE__ = true;

      /* GA4 REVENUE EVENT */
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "revenue_intent", {
          intent: revenueState.trafficIntent,
          page: path,
        });
      }

      /* FACEBOOK VALUE SIGNAL */
      if (typeof window.fbq !== "undefined") {
        window.fbq("trackCustom", "RevenueIntent", {
          intent: revenueState.trafficIntent,
        });
      }
    };

    /* ================= DELAYED ACTIVATION ================= */
    const events = ["scroll", "click", "touchstart"];

    const handler = () => {
      trackRevenueSignal();
      events.forEach((e) =>
        window.removeEventListener(e, handler)
      );
    };

    events.forEach((e) =>
      window.addEventListener(e, handler, { passive: true })
    );

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, handler)
      );
    };
  }, []);
}

/* ================= GLOBAL APP ================= */
export default function App({ Component, pageProps }) {
  const router = useRouter();

  useRevenueOS(router);

  /* ================= ROUTE REVENUE TRACKING ================= */
  useEffect(() => {
    const handleRoute = (url) => {
      requestIdleCallback(() => {
        if (typeof window.gtag !== "undefined") {
          window.gtag("config", "G-YS8L61XLPR", {
            page_path: url,
          });
        }
      });
    };

    router.events.on("routeChangeComplete", handleRoute);
    return () =>
      router.events.off("routeChangeComplete", handleRoute);
  }, [router.events]);

  return (
    <>
      {/* ================= SEO CORE ================= */}
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="description"
          content="Koloonline V6 Revenue OS - Autonomous Affiliate Profit Engine"
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://koloonline.online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ================= GA4 ================= */}
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

      {/* ================= FACEBOOK PIXEL ================= */}
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

      {/* ================= ADSENSE ================= */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />

      {/* ================= SPEED INSIGHTS ================= */}
      <SpeedInsights />

      {/* ================= APP ================= */}
      <Component {...pageProps} />
    </>
  );
            }
