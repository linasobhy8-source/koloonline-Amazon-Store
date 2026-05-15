import Head from "next/head";

export default function TikTokAmazonGadgets() {
  return (
    <>
      <Head>
        <title>Trending TikTok Amazon Gadgets</title>

        <meta
          name="description"
          content="Viral TikTok gadgets and trending Amazon products everyone is buying this year."
        />

        <link
          rel="canonical"
          href="https://koloonline.online/blog/tiktok-amazon-gadgets"
        />
      </Head>

      <main style={styles.main}>
        <h1>📱 Trending TikTok Amazon Gadgets</h1>

        <p>
          These Amazon gadgets are trending across TikTok and social media.
        </p>

        <ul>
          <li>Smart RGB Lights</li>
          <li>Portable Projectors</li>
          <li>Mini Wireless Printers</li>
          <li>Phone Cooling Fans</li>
          <li>Bluetooth Sleep Speakers</li>
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
