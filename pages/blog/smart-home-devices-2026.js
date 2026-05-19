import Head from "next/head";

export default function SmartHomeDevices() {
  return (
    <>
      <Head>
        <title>Smart Home Devices 2026</title>
        <meta name="description" content="Best smart home products" />
        <link rel="canonical" href="https://koloonline.online/blog/smart-home-devices-2026" />
      </Head>

      <main style={styles.main}>
        <h1>🏠 Smart Home Devices</h1>

        <ul>
          <li>Smart Cameras</li>
          <li>Alexa Devices</li>
          <li>Robot Vacuum</li>
        </ul>

        <section style={styles.linksBox}>
          <h3>🔥 Continue Reading</h3>
          <div>
            <a href="/blog/viral-products-amazon">🔥 Viral Products</a><br />
            <a href="/blog/budget-tech-products">💻 Budget Tech</a><br />
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
