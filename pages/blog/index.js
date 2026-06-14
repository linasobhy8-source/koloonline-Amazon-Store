import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

/* ================= SAFE IMAGE ================= */
const fallbackImage =
  "https://via.placeholder.com/500x300?text=Koloonline";

/* ================= BLOG PAGE ================= */
export default function Blog({ posts }) {
  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f5f5" }}>
      
      {/* ================= SEO ================= */}
      <Head>
        <title>Amazon Deals Blog | Koloonline Reviews & Guides</title>

        <meta
          name="description"
          content="Explore Amazon product reviews, buying guides, and trending deals with structured insights and comparison-based articles."
        />

        <meta
          name="keywords"
          content="amazon deals, product reviews, buying guide, koloonline blog, tech reviews, shopping tips"
        />

        {/* ================= ROBOTS ================= */}
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="author" content="Koloonline" />
        <meta name="publisher" content="Koloonline" />

        <link rel="canonical" href="https://koloonline.online/blog" />

        {/* ================= RSS ================= */}
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" />

        {/* ================= OPEN GRAPH ================= */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Koloonline" />
        <meta property="og:url" content="https://koloonline.online/blog" />
        <meta
          property="og:title"
          content="Amazon Deals Blog | Koloonline Reviews & Guides"
        />
        <meta
          property="og:description"
          content="Amazon reviews, buying guides, and trending deals."
        />

        {/* ================= TWITTER ================= */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Koloonline Blog" />
        <meta
          name="twitter:description"
          content="Amazon reviews and buying guides"
        />

        {/* ================= STRUCTURED DATA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "Koloonline Blog",
              url: "https://koloonline.online/blog",
              description:
                "Amazon product reviews, buying guides, and deal insights",
              publisher: {
                "@type": "Organization",
                name: "Koloonline",
              },
            }),
          }}
        />
      </Head>

      {/* ================= HEADER ================= */}
      <h1>🔥 Amazon Reviews & Buying Guides</h1>

      <p style={{ color: "#555", maxWidth: 800 }}>
        Browse structured articles that summarize product features, general market
        feedback, and comparison-based insights to help with purchasing decisions.
      </p>

      {/* ================= POSTS GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {posts?.map((post) => (
          <div
            key={post.id}
            style={{
              background: "white",
              padding: 15,
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            {/* ================= IMAGE ================= */}
            <Image
              src={post.image || fallbackImage}
              width={500}
              height={300}
              alt={post.title || "blog image"}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />

            {/* ================= BADGE ================= */}
            {post.auto && (
              <span
                style={{
                  display: "inline-block",
                  background: "#16a34a",
                  color: "white",
                  padding: "3px 8px",
                  fontSize: 11,
                  borderRadius: 8,
                  marginTop: 8,
                }}
              >
                🔥 AUTO GENERATED
              </span>
            )}

            {/* ================= TITLE ================= */}
            <h2 style={{ fontSize: 18, marginTop: 10 }}>
              {post.title}
            </h2>

            {/* ================= EXCERPT ================= */}
            <p style={{ fontSize: 13, color: "#666" }}>
              {post.excerpt?.slice(0, 140) ||
                "This article provides structured product information, general user feedback patterns, and comparison-based insights."}
            </p>

            {/* ================= INSIGHTS ================= */}
            <div
              style={{
                marginTop: 10,
                padding: 10,
                background: "#f9fafb",
                borderRadius: 10,
                fontSize: 12,
                color: "#444",
              }}
            >
              <b>📊 General Overview:</b>
              <p>• Value, features, and usability are key factors.</p>
              <p>• Feedback varies based on user expectations.</p>
              <p>• Performance consistency is commonly evaluated.</p>
            </div>

            {/* ================= SCORE ================= */}
            <p style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
              Trending Score: {post.trendingScore || 0}
            </p>

            {/* ================= LINK ================= */}
            {post.productId && (
              <Link href={`/product/${post.productId}`}>
                <p style={{ color: "#2563eb", fontSize: 12 }}>
                  🔗 View Related Product
                </p>
              </Link>
            )}

            {/* ================= CTA ================= */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <Link href={`/blog/${post.id}`}>
                <button
                  style={{
                    padding: "10px 15px",
                    background: "#ff9900",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  📖 Read
                </button>
              </Link>

              {post.productId && (
                <Link href={`/product/${post.productId}`}>
                  <button
                    style={{
                      padding: "10px 15px",
                      background: "#25D366",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    🛒 View Product
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SERVER SIDE ================= */
export async function getServerSideProps() {
  const snap = await getDocs(
    query(collection(db, "blog"), orderBy("createdAt", "desc"))
  );

  let posts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  /* ================= TRENDING SCORE ================= */
  posts = posts.map((p) => {
    const created = p.createdAt?.toDate?.() || new Date();

    const hoursOld =
      (Date.now() - new Date(created).getTime()) /
      (1000 * 60 * 60);

    const freshnessBoost = Math.max(0, 30 - hoursOld * 1.2);
    const engagementBoost =
      (p.views || 0) * 2 +
      (p.likes || 0) * 3 +
      (p.clicks || 0) * 1.5;

    const automationBoost = p.auto ? 15 : 0;
    const contentFactor = (p.title?.length || 0) / 12;
    const featuredBoost = p.featured ? 20 : 0;

    return {
      ...p,
      trendingScore:
        freshnessBoost +
        engagementBoost +
        automationBoost +
        contentFactor +
        featuredBoost,
    };
  });

  posts.sort((a, b) => b.trendingScore - a.trendingScore);

  return {
    props: { posts },
  };
            }
