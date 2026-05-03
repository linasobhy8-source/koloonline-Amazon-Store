import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* ================= SEO GLOBAL ================= */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Koloonline Amazon Affiliate Store - Best Deals Daily" />
        <meta name="keywords" content="amazon deals, online shopping, best offers, koloonline" />

        {/* Open Graph */}
        <meta property="og:title" content="Koloonline Amazon Store" />
        <meta property="og:description" content="Best Amazon Deals Updated Daily" />
        <meta property="og:image" content="https://www.koloonline.online/favicon.ico" />
        <meta property="og:type" content="website" />
      </Head>

      {/* ================= GOOGLE ANALYTICS ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"
        strategy="afterInteractive"
      />
      <Script id="ga-script" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YS8L61XLPR');
        `}
      </Script>

      {/* ================= FACEBOOK PIXEL ================= */}
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;
            n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

          fbq('init','353894198840203');
          fbq('track','PageView');
        `}
      </Script>

      {/* ================= ADSENSE ================= */}
      <Script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
        crossOrigin="anonymous"
      />

      <Component {...pageProps} />
    </>
  );
    }
