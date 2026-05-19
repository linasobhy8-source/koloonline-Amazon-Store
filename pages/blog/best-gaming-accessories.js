import Head from "next/head";

export default function BestGamingAccessories() {
  return (
    <>
      <Head>
        <title>Best Gaming Accessories</title>
        <meta name="description" content="Top gaming gear on Amazon" />
        <link rel="canonical" href="https://koloonline.online/blog/best-gaming-accessories" />
      </Head>

      <main style={styles.main}>
        <h1>🎮 Best Gaming Accessories</h1>

        <ul>
          <li>RGB Keyboards</li>
          <li>Gaming Mouse</li>
          <li>Headsets</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/best-headphones-2026">🎧 Headphones</a><br />
            <a href="/blog/best-smart-watches">⌚ Smart Watches</a><br />
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
