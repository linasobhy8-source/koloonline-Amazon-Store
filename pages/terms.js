import Head from "next/head";

export default function Terms() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial",
        lineHeight: 1.8,
      }}
    >
      <Head>
        <title>Terms of Service | Koloonline</title>

        <meta
          name="description"
          content="Terms and conditions governing the use of Koloonline content, affiliate links, services, and website access."
        />

        <meta
          name="keywords"
          content="terms of service, website terms, affiliate disclosure, user agreement"
        />

        <meta name="robots" content="index,follow" />
      </Head>

      <h1>Terms of Service</h1>

      <h2>Acceptance</h2>

      <p>
        By using Koloonline you agree to these terms and conditions.
      </p>

      <h2>Content</h2>

      <p>
        Content is provided for informational and educational purposes.
      </p>

      <h2>Affiliate Relationships</h2>

      <p>
        Some links may generate commissions for Koloonline.
      </p>

      <h2>No Guarantees</h2>

      <p>
        Product prices, availability, ratings, and information may change
        without notice.
      </p>

      <h2>Limitation of Liability</h2>

      <p>
        Users are responsible for verifying product information before
        making purchasing decisions.
      </p>

      <h2>Updates</h2>

      <p>
        We may modify these terms at any time.
      </p>
    </div>
  );
          }
