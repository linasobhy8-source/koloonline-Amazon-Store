import Head from "next/head";

export default function ViralProductsAmazon() {
  return (
    <>
      <Head>
        <title>Best Viral Products on Amazon Right Now</title>

        <meta
          name="description"
          content="Explore the most viral and trending Amazon products people are buying right now."
        />

        <link
          rel="canonical"
          href="https://koloonline.online/blog/viral-products-amazon"
        />
      </Head>

      <main style={styles.main}>
        <h1>🔥 Best Viral Products on Amazon</h1>

        <p>
          Viral Amazon finds and TikTok products trending this month.
        </p>

        <ul>
          <li>Portable Ice Makers</li>
          <li>LED Strip Lights</li>
          <li>Mini Coffee Machines</li>
          <li>Smart Water Bottles</li>
          <li>Car Cleaning Gadgets</li>
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
