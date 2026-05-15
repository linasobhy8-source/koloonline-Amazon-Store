import Head from "next/head";

export default function UsbCAccessories() {
  return (
    <>
      <Head>
        <title>USB-C Accessories</title>
        <meta name="description" content="Best USB-C gadgets" />
        <link rel="canonical" href="https://koloonline.online/blog/usb-c-accessories" />
      </Head>

      <main style={styles.main}>
        <h1>🔌 USB-C Accessories</h1>

        <ul>
          <li>Fast Chargers</li>
          <li>Hubs</li>
          <li>Cables</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/budget-tech-products">💻 Budget Tech</a><br />
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
