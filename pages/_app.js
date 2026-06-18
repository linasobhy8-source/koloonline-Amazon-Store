import Head from "next/head";
import Script from "next/script";
import { Component } from "react";

import { SpeedInsights } from "@vercel/speed-insights/next";

import "../styles/globals.css";

/* ================= ERROR BOUNDARY ================= */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
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
            textAlign: "center",
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
export default function App({
  Component,
  pageProps,
}) {
  return (
    <ErrorBoundary>
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
            name="theme-color"
            content="#111827"
          />

          <meta
            name="author"
            content="Koloonline"
          />

          <meta
            name="application-name"
            content="Koloonline"
          />

          <link
            rel="icon"
            href="/favicon.ico"
          />
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
                    dl=l!='dataLayer'
                      ? '&l='+l
                      : '';

                j.async=true;
                j.src=
                  'https://www.googletagmanager.com/gtm.js?id='
                  + i + dl;

                f.parentNode.insertBefore(j,f);
              })(
                window,
                document,
                'script',
                'dataLayer',
                'GTM-KNQM8KBN'
              );
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
              window.dataLayer =
                window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments);
              }

              gtag('js', new Date());

              gtag(
                'config',
                'G-YS8L61XLPR',
                {
                  page_path:
                    window.location.pathname,
                }
              );
            `,
          }}
        />

        {/* ================= NOSCRIPT ================= */}
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

        {/* ================= TEST ================= */}
        {/* Navbar Disabled */}
        {/* Footer Disabled */}

        <main>
          <Component {...pageProps} />
        </main>

        <SpeedInsights />
      </>
    </ErrorBoundary>
  );
              }
