
import Head from "next/head";

export default function About() {
  return (
    <div style={styles.container}>
      
      <Head>
        <title>About Us | Koloonline</title>

        <meta
          name="description"
          content="Learn more about Koloonline, our mission, content policy, and how we create helpful product recommendations."
        />

        {/* ================= SEO CONTROL ================= */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.koloonline.online/about" />

        {/* Open Graph */}
        <meta property="og:title" content="About Koloonline" />
        <meta
          property="og:description"
          content="Learn about Koloonline mission, content policy and product recommendation system."
        />
        <meta property="og:type" content="website" />
      </Head>

      <h1>About Koloonline</h1>

      <p>
        Koloonline is an online content and deals platform focused on providing
        helpful product recommendations, shopping guides, and informational articles.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to help users discover useful products and make smarter online shopping decisions
        through clear, structured, and data-driven content.
      </p>

      <h2>Who Creates Our Content</h2>
      <p>
        Content is created using AI-assisted systems combined with editorial review
        to ensure quality, relevance, and accuracy.
      </p>

      <h2>Content Policy</h2>
      <ul>
        <li>We do not publish misleading or harmful content</li>
        <li>We focus on informational and product discovery value</li>
        <li>We regularly update data based on trends and performance signals</li>
      </ul>

      <h2>Contact</h2>
      <p>Email: support@koloonline.online</p>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    padding: 20,
    fontFamily: "Arial",
    lineHeight: "1.6",
  },
};
