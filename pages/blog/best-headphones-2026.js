import Head from "next/head";

export default function BestHeadphones() {
  return (
    <>
      <Head>
        <title>Best Headphones 2026</title>
        <meta name="description" content="Top headphones on Amazon" />
        <link rel="canonical" href="https://koloonline.online/blog/best-headphones-2026" />
      </Head>

      <main style={styles.main}>
        <h1>🎧 Best Headphones</h1>

        <p>Noise cancelling and wireless headphones.</p>

        <ul>
          <li>Wireless Audio</li>
          <li>Noise Cancelling</li>
          <li>Deep Bass</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/best-smart-watches">⌚ Smart Watches</a><br />
            <a href="/blog/best-power-banks-2026">🔋 Power Banks</a><br />
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
