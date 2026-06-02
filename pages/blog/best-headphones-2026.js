import Head from "next/head";
import Link from "next/link";

export default function BestHeadphones() {
  return (
    <>
      {/* ================= SEO ================= */}
      <Head>
        <title>Best Headphones 2026 | Koloonline</title>

        <meta
          name="description"
          content="Discover the best headphones on Amazon including wireless, noise cancelling, and deep bass models."
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href="https://koloonline.online/blog/best-headphones-2026"
        />

        <meta property="og:title" content="Best Headphones 2026" />
        <meta
          property="og:description"
          content="Top Amazon headphones for 2026"
        />
      </Head>

      {/* ================= MAIN ================= */}
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 20px",
          fontFamily: "Arial",
        }}
      >
        <h1>🎧 Best Headphones</h1>

        <p>Noise cancelling and wireless headphones.</p>

        {/* ================= FEATURES ================= */}
        <ul>
          <li>Wireless Audio</li>
          <li>Noise Cancelling</li>
          <li>Deep Bass</li>
        </ul>

        {/* ================= INTERNAL LINKS ================= */}
        <section
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "#f8f8f8",
            borderRadius: "12px",
          }}
        >
          <h3>🔥 Continue Reading</h3>

          <div>
            <Link href="/blog/best-smart-watches">
              ⌚ Smart Watches
            </Link>

            <br />

            <Link href="/blog/best-power-banks-2026">
              🔋 Power Banks
            </Link>

            <br />

            <Link href="/amazon-haul">
              🛒 Amazon Trending Haul
            </Link>
          </div>
        </section>
      </main>
    </>
  );
            }
