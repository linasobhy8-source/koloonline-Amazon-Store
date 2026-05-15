import Head from "next/head";

export default function BestGamingAccessories() {
  return (
    <>
      <Head>
        <title>Best Gaming Accessories on Amazon</title>

        <meta
          name="description"
          content="Top gaming accessories including RGB keyboards, gaming mice, chairs, and budget gaming setup ideas."
        />

        <link
          rel="canonical"
          href="https://koloonline.online/blog/best-gaming-accessories"
        />
      </Head>

      <main style={styles.main}>
        <h1>🎮 Best Gaming Accessories</h1>

        <p>
          Upgrade your gaming setup with these top-rated Amazon gaming products.
        </p>

        <ul>
          <li>RGB Gaming Keyboards</li>
          <li>Gaming Mouse Pads</li>
          <li>Budget Gaming Chairs</li>
          <li>LED Gaming Lights</li>
          <li>Wireless Gaming Headsets</li>
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
