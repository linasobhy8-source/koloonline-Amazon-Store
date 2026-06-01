import Head from "next/head";

export default function Privacy() {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <Head>
        <title>Privacy Policy | Koloonline</title>
        <meta name="description" content="Privacy Policy for Koloonline" />
        <meta name="robots" content="index,follow" />
      </Head>

      <h1>Privacy Policy</h1>

      <p>We respect your privacy and do not sell data.</p>

      <h2>Cookies</h2>
      <p>We use cookies for analytics and ads (Google AdSense).</p>

      <h2>Contact</h2>
      <p>support@koloonline.online</p>
    </div>
  );
}
