import Head from "next/head";

export default function Disclaimer() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial",
        lineHeight: 1.8,
        background: "#fff",
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>Affiliate Disclaimer | Koloonline</title>

        <meta
          name="description"
          content="Affiliate disclosure and advertising disclaimer for Koloonline."
        />

        <meta
          name="keywords"
          content="affiliate disclaimer, amazon affiliate, advertising disclosure"
        />

        <meta name="robots" content="index,follow" />
        <link
          rel="canonical"
          href="https://koloonline.online/disclaimer"
        />
      </Head>

      {/* ================= CONTENT ================= */}
      <h1>Affiliate Disclaimer</h1>

      <p>
        Koloonline participates in affiliate marketing programs.
      </p>

      <p>
        Some links on this website may generate a commission when a
        purchase is completed.
      </p>

      <p>
        This commission does not affect the price paid by the customer.
      </p>

      <p>
        Product information, pricing, ratings, and availability may change
        over time.
      </p>

      <p>
        Readers should verify information directly with the merchant before
        making purchasing decisions.
      </p>
    </div>
  );
        }
