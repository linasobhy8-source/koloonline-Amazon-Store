import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=a62092fd965664e67";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}
