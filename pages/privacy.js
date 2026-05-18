import Head from "next/head";

export default function Privacy() {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <Head>
        <title>Privacy Policy | Koloonline</title>
        <meta name="robots" content="index, follow" />
      </Head>

      <h1>Privacy Policy</h1>

      <p>
        Koloonline respects your privacy. We do not sell personal data.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies to improve user experience and show relevant ads via Google AdSense.
      </p>

      <h2>Google AdSense</h2>
      <p>
        Third-party vendors, including Google, use cookies to serve ads based on prior visits.
      </p>

      <h2>Data Collection</h2>
      <p>
        We may collect analytics data (non-personal) to improve website performance.
      </p>

      <h2>Contact</h2>
      <p>support@koloonline.online</p>
    </div>
  );
  }
