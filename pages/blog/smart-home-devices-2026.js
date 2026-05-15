import Head from "next/head";

export default function SmartHomeDevices() {
  return (
    <>
      <Head>
        <title>Top Smart Home Devices in 2026</title>

        <meta
          name="description"
          content="Discover the best smart home devices and Amazon gadgets for modern homes in 2026."
        />

        <link
          rel="canonical"
          href="https://koloonline.online/blog/smart-home-devices-2026"
        />
      </Head>

      <main style={styles.main}>
        <h1>🏠 Top Smart Home Devices</h1>

        <p>
          Smart home products that improve comfort, security, and convenience.
        </p>

        <ul>
          <li>Smart Doorbells</li>
          <li>Robot Vacuum Cleaners</li>
          <li>WiFi Smart Plugs</li>
          <li>Alexa Compatible Lights</li>
          <li>Smart Cameras</li>
        </ul>
      </main>
    </>
  );
}

const styles = {
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
    lineHeight: 1.8,
    fontFamily: "Arial",
  },
};
