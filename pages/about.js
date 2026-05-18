import Head from "next/head";

export default function About() {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      
      <Head>
        <title>About Us | Koloonline</title>
        <meta name="description" content="Learn more about Koloonline, our mission and content policy." />
        <meta name="robots" content="index, follow" />
      </Head>

      <h1>About Koloonline</h1>

      <p>
        Koloonline is an online content and deals platform focused on providing
        helpful product recommendations, shopping guides, and informational articles.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to help users discover useful products and make smarter online shopping decisions
        through clear, honest, and structured content.
      </p>

      <h2>Who Creates Our Content</h2>
      <p>
        Content is created using a combination of editorial review and AI-assisted tools,
        with final human validation to ensure quality and usefulness.
      </p>

      <h2>Content Policy</h2>
      <ul>
        <li>We do not publish misleading or harmful content</li>
        <li>We focus on informational and educational value</li>
        <li>We regularly update content for accuracy</li>
      </ul>

      <h2>Contact</h2>
      <p>Email: support@koloonline.online</p>
    </div>
  );
          }
