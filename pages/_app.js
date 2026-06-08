import Head from "next/head";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Component } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import "../styles/globals.css";

/* ================= ERROR BOUNDARY (CRASH PROTECTION) ================= */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 20,
            fontFamily: "sans-serif",
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

        {/* ================= LAYOUT ================= */}
        <Navbar />

        <main>
          <Component {...pageProps} />
        </main>

        <Footer />

        {/* ================= ANALYTICS ================= */}
        <SpeedInsights />
      </>
    </ErrorBoundary>
  );
  }
