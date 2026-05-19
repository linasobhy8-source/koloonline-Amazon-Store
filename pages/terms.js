import Head from "next/head";

export default function Terms() {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <Head>
        <title>Terms of Service | Koloonline</title>
        <meta name="robots" content="index, follow" />
      </Head>

      <h1>Terms of Service</h1>

      <h2>Use of Site</h2>
      <p>
        You agree to use Koloonline only for lawful purposes and informational browsing.
      </p>

      <h2>Content</h2>
      <p>
        All content is provided for informational purposes only.
      </p>

      <h2>Affiliate Disclosure</h2>
      <p>
        Some links may be affiliate links, meaning we may earn commission at no extra cost to you.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms at any time.
      </p>
    </div>
  );
  }
