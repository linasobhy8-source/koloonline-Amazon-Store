import Head from "next/head";
import Script from "next/script";
import { Component } from "react";

import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "../styles/globals.css";

/* ================= ERROR BOUNDARY ================= */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash:", error);
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 20,
            fontFamily: "Arial",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚠️ Something went wrong. Please refresh the page.
        </div>
      );
    }

    return this.props.children;
  }
}

/* ================= APP ================= */
export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index,follow,max-image-preview:large" />
          <meta name="theme-color" content="#111827" />
          <meta name="format-detection" content="telephone=no" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="author" content="Koloonline" />
          <meta name="application-name" content="Koloonline" />

          <meta
            name="keywords"
            content="Amazon Deals, Amazon Haul, Amazon Reviews, Product Reviews, Smart Watches, Tech Gadgets, AliExpress Deals, Online Shopping, Best Products, Koloonline"
          />

          <link rel="icon" href="/favicon.ico" />
          <link rel="canonical" href="https://koloonline.online" />
        </Head>

        {/* ================= GTM ================= */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({
                  'gtm.start': new Date().getTime(),
                  event:'gtm.js'
                });

                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer' ? '&l='+l : '';

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
          strategy="afterInteractive"
        />

        <Script
          id="ga4"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];

              function gtag(){dataLayer.push(arguments);}

              gtag('js', new Date());

              gtag('config', 'G-YS8L61XLPR', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* ================= NOSCRIPT GTM ================= */}
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

        {/* ================= SPEED INSIGHTS ================= */}
        <SpeedInsights />
      </>
    </ErrorBoundary>
  );
    }
