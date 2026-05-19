import Head from "next/head";

export default function AmazonFindsUnder25() {
  return (
    <>
      <Head>
        <title>Best Amazon Finds Under $25</title>
        <meta name="description" content="Cheap Amazon viral finds" />
        <link rel="canonical" href="https://koloonline.online/blog/amazon-finds-under-25" />
      </Head>

      <main style={styles.main}>
        <h1>🔥 Under $25 Finds</h1>

        <ul>
          <li>LED Lights</li>
          <li>Mini Blender</li>
          <li>Phone Stand</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/tiktok-amazon-gadgets">📱 TikTok Gadgets</a><br />
            <a href="/blog/viral-products-amazon">🔥 Viral Products</a><br />
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
