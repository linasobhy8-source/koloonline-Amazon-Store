import Head from "next/head";

export default function BudgetTechProducts() {
  return (
    <>
      <Head>
        <title>Budget Tech Products</title>
        <meta name="description" content="Affordable tech gadgets" />
        <link rel="canonical" href="https://koloonline.online/blog/budget-tech-products" />
      </Head>

      <main style={styles.main}>
        <h1>💻 Budget Tech Products</h1>

        <ul>
          <li>Cheap Earbuds</li>
          <li>Power Banks</li>
          <li>USB Accessories</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/usb-c-accessories">🔌 USB-C Accessories</a><br />
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
