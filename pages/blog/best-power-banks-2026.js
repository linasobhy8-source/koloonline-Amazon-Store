import Head from "next/head";

export default function BestPowerBanks() {
  return (
    <>
      <Head>
        <title>Best Power Banks 2026</title>
        <meta name="description" content="Top power banks for travel and gaming" />
        <link rel="canonical" href="https://koloonline.online/blog/best-power-banks-2026" />
      </Head>

      <main style={styles.main}>
        <h1>🔋 Best Power Banks</h1>

        <p>Fast charging power banks for all devices.</p>

        <ul>
          <li>Fast Charge</li>
          <li>20,000 mAh+</li>
          <li>USB-C Support</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/best-smart-watches">⌚ Smart Watches</a><br />
            <a href="/blog/best-headphones-2026">🎧 Headphones</a><br />
            <a href="/amazon-haul">🛒 Amazon Trending Haul</a>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  main: { maxWidth: "900px", margin: "0 auto", padding: "40px 20px", fontFamily: "Arial" },
  linksBox: { marginTop: "40px", padding: "20px", background: "#f8f8f8", borderRadius: "12px" },
};
