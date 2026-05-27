import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "../styles/globals.css";

/* ================= SAFE IDLE ================= */

const safeIdle = (callback) => {
  if (
    typeof window !== "undefined" &&
    "requestIdleCallback" in window
  ) {
    return window.requestIdleCallback(callback);
  }

  return setTimeout(callback, 1);
};

/* ================= GLOBAL REVENUE STATE ================= */

const revenueState = {
  trafficIntent: "unknown",
};

/* ================= AI REVENUE ENGINE ================= */

function useRevenueOS() {
  const initialized = useRef(false);

  const router = useRouter();

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    const detectIntent = () => {
      if (typeof window === "undefined") return;

      const path =
        window.location.pathname || "";

      revenueState.trafficIntent =
        path.includes("/product/")
          ? "high_intent"
          : path.includes("/blog/")
          ? "medium_intent"
          : "low_intent";

      console.log(
        "AI Revenue Intent:",
        revenueState.trafficIntent
      );
    };

    detectIntent();

    router.events.on(
      "routeChangeComplete",
      detectIntent
    );

    return () => {
      router.events.off(
        "routeChangeComplete",
        detectIntent
      );
    };
  }, [router]);
}

/* ================= APP ================= */

export default function App({
  Component,
  pageProps,
}) {
  useRevenueOS();

  useEffect(() => {
    safeIdle(() => {
      console.log(
        "Koloonline AI Shopping OS Loaded"
      );
    });
  }, []);

  return (
    <>
      {/* ================= GLOBAL SEO ================= */}

      <Head>
        <meta
          charSet="UTF-8"
        />

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

      {/* ================= GOOGLE ANALYTICS ================= */}

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="afterInteractive"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            dataLayer.push(arguments);
          }

          gtag('js', new Date());

          gtag('config', 'G-YS8L61XLPR');
        `}
      </Script>

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= PAGE ================= */}

      <Component {...pageProps} />

      {/* ================= FOOTER ================= */}

      <Footer />

      {/* ================= VERCEL ANALYTICS ================= */}

      <SpeedInsights />
    </>
  );
            }
