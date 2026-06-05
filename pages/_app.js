import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111827" />
      </Head>

      {/* DEFER ALL ADS/ANALYTICS */}
      <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR" />

      <Navbar />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />

      <SpeedInsights />
    </>
  );
}
