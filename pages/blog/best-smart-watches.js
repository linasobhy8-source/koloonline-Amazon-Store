import Head from "next/head";

export default function BestSmartWatches() {
  return (
    <>
      <Head>
        <title>Best Smart Watches on Amazon</title>
        <meta name="description" content="Top smart watches in 2026" />
        <link rel="canonical" href="https://koloonline.online/blog/best-smart-watches" />
      </Head>

      <main style={styles.main}>
        <h1>⌚ Best Smart Watches</h1>

        <p>Top trending smart watches on Amazon.</p>

        <ul>
          <li>Fitness Tracking</li>
          <li>Heart Rate Monitor</li>
          <li>Sleep Tracking</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/best-headphones-2026">🎧 Headphones</a><br />
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
