import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next"; // ✅ FIXED

/* ================= V6 REVENUE STATE ================= */
const revenueState = {
  trafficIntent: "unknown",
};

/* ================= SAFE REQUEST IDLE ================= */
const safeIdle = (cb) => {
  if (typeof window === "undefined") return cb();
  if (window.requestIdleCallback) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 200);
  }
};

/* ================= REVENUE ENGINE ================= */
function useRevenueOS(router) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const path = window.location.pathname;

    /* ================= INTENT DETECTION ================= */
    revenueState.trafficIntent =
      path.includes("/product/")
        ? "high_intent"
        : path.includes("/blog/")
        ? "medium_intent"
        : "low_intent";

    /* ================= LAZY REVENUE SIGNAL ================= */
    const fireRevenueSignal = () => {
      if (window.__REVENUE_OS_ACTIVE__) return;
      window.__REVENUE_OS_ACTIVE__ = true;

      safeIdle(() => {
        window.gtag?.("event", "revenue_intent", {
          intent: revenueState.trafficIntent,
          page: path,
        });

        window.fbq?.("trackCustom", "RevenueIntent", {
          intent: revenueState.trafficIntent,
        });
      });
    };

    /* ================= INTERACTION TRIGGER ================= */
    const events = ["scroll", "click", "touchstart"];

    const handler = () => {
      fireRevenueSignal();
      events.forEach((e) => window.removeEventListener(e, handler));
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

  /* ================= ROUTE TRACKING ================= */
  useEffect(() => {
    const handleRoute = (url) => {
      safeIdle(() => {
        window.gtag?.("config", "G-YS8L61XLPR", {
          page_path: url,
        });
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <meta
          name="description"
          content="Koloonline V6 Revenue OS - AI Affiliate Profit Engine"
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://koloonline.online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ================= GA4 (NON-BLOCKING) ================= */}
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
          gtag('config', 'G-YS8L61XLPR', {
            send_page_view: false
          });
        `}
      </Script>

      {/* ================= FACEBOOK PIXEL (LAZY) ================= */}
      <Script id="fb-pixel" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '353894198840203');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* ================= ADSENSE (DEFERRED) ================= */}
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
