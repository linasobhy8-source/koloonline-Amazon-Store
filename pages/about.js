import Head from "next/head";

export default function About() {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <Head>
        <title>About Us - Koloonline</title>
        <meta name="description" content="About Koloonline Amazon Affiliate Store" />
      </Head>

      <h1>About Koloonline</h1>

      <p>
        Koloonline is an Amazon affiliate store that helps users discover the best products,
        deals, and reviews in one place.
      </p>

      <p>
        We focus on providing curated recommendations, honest reviews, and trending products
        across categories like electronics, fashion, and home.
      </p>

      <p>
        Our mission is to simplify your shopping experience and help you make better buying decisions.
      </p>

      <p>
        We may earn commissions from Amazon when you purchase through our links.
      </p>
    </div>
  );
}
