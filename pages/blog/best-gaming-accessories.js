import Head from "next/head";
import Link from "next/link";

export default function BestGamingAccessories() {
  return (
    <>
      {/* ================= SEO ================= */}
      <Head>
        <title>Best Gaming Accessories | Koloonline</title>

        <meta
          name="description"
          content="Top gaming accessories on Amazon including RGB keyboards, gaming mice, and headsets."
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href="https://koloonline.online/blog/best-gaming-accessories"
        />

        <meta property="og:title" content="Best Gaming Accessories" />
        <meta
          property="og:description"
          content="Top gaming gear on Amazon"
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
        <h1>🎮 Best Gaming Accessories</h1>

        {/* ================= LIST ================= */}
        <ul>
          <li>RGB Keyboards</li>
          <li>Gaming Mouse</li>
          <li>Headsets</li>
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
            <Link href="/blog/best-headphones-2026">
              🎧 Headphones
            </Link>

            <br />

            <Link href="/blog/best-smart-watches">
              ⌚ Smart Watches
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
