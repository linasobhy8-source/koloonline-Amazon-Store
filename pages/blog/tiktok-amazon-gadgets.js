import Head from "next/head";

export default function TikTokAmazonGadgets() {
  return (
    <>
      <Head>
        <title>TikTok Amazon Gadgets</title>
        <meta name="description" content="Trending TikTok gadgets" />
        <link rel="canonical" href="https://koloonline.online/blog/tiktok-amazon-gadgets" />
      </Head>

      <main style={styles.main}>
        <h1>📱 TikTok Gadgets</h1>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/amazon-finds-under-25">💸 Under $25</a><br />
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
