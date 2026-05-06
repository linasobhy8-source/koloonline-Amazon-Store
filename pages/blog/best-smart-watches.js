import Head from "next/head";

export default function Blog() {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Best Smart Watches 2026</title>
        <meta name="description" content="Top smart watches you should buy in 2026" />
      </Head>

      <h1>Best Smart Watches 2026</h1>

      <p>
        Smart watches are becoming essential gadgets for tracking fitness,
        notifications, and productivity.
      </p>

      <h2>Top Features</h2>
      <ul>
        <li>Heart Rate Monitoring</li>
        <li>Sleep Tracking</li>
        <li>Bluetooth Calling</li>
      </ul>

      <p>
        Choosing the right smart watch depends on your lifestyle and budget.
      </p>

      {/* 🔥 Affiliate CTA */}
      <div style={{ marginTop: 30 }}>
        <a
          href="https://www.amazon.com/dp/B0GWTCCHFZ?tag=koloonlinesto-20"
          target="_blank"
          rel="nofollow sponsored"
        >
          <button
            style={{
              padding: "12px 20px",
              background: "#ff9900",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🛒 Buy Smart Watch on Amazon
          </button>
        </a>
      </div>
    </div>
  );
}
