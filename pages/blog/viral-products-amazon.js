import Head from "next/head";

export default function ViralProductsAmazon() {
  return (
    <>
      <Head>
        <title>Viral Amazon Products</title>
        <meta name="description" content="Most viral Amazon products" />
        <link rel="canonical" href="https://koloonline.online/blog/viral-products-amazon" />
      </Head>

      <main style={styles.main}>
        <h1>🔥 Viral Amazon Products</h1>

        <ul>
          <li>LED Strip Lights</li>
          <li>Mini Gadgets</li>
          <li>Car Accessories</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/amazon-finds-under-25">💸 Under $25</a><br />
            <a href="/blog/tiktok-amazon-gadgets">📱 TikTok Gadgets</a><br />
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
