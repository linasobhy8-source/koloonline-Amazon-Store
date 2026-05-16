import Head from "next/head";

export default function Contact() {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Contact Us - Koloonline</title>

        {/* ================= SEO FIX ================= */}
        <meta name="robots" content="noindex, follow" />
        <meta
          name="description"
          content="Contact Koloonline support for help, questions, and partnership inquiries."
        />
      </Head>

      <h1>Contact Us</h1>

      <p>
        📧 Email: <strong>support@koloonline.online</strong>
      </p>

      <p>
        If you have any questions about products, orders, or partnerships,
        feel free to contact us anytime and we will respond as soon as possible.
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h3>⚡ Quick Info</h3>

      <ul>
        <li>Support: 24–48 hours response</li>
        <li>Business inquiries welcome</li>
        <li>Affiliate support available</li>
      </ul>
    </div>
  );
            }
