import Head from "next/head";
import Link from "next/link";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

/* ================= BLOG PAGE ================= */
export default function Blog({ posts }) {
  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>Blog | Koloonline Amazon Deals</title>

        <meta
          name="description"
          content="Discover Amazon guides, reviews, trending deals and smart shopping tips updated daily on Koloonline blog."
        />

        <meta
          name="keywords"
          content="amazon blog, amazon deals, product reviews, shopping guide, koloonline"
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://koloonline.online/blog" />

        {/* ================= BLOG SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "Koloonline Blog",
              url: "https://koloonline.online/blog",
              description:
                "Amazon deals, guides and trending product reviews",
            }),
          }}
        />
      </Head>

      <h1>🔥 Trending Blog Articles</h1>

      <p style={{ color: "#666" }}>
        Discover the latest Amazon deals, reviews, and buying guides.
      </p>

      {/* ================= POSTS GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "white",
              padding: 15,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >

            {/* 🔥 AUTO BADGE */}
            {post.auto && (
              <span
                style={{
                  background: "green",
                  color: "white",
                  padding: "3px 8px",
                  fontSize: 11,
                  borderRadius: 8,
                }}
              >
                🔥 AUTO BLOG
              </span>
            )}

            <h2 style={{ fontSize: 18, marginTop: 10 }}>
              {post.title}
            </h2>

            {/* 🧠 SEO EXCERPT */}
            <p style={{ fontSize: 13, color: "#666" }}>
              {post.excerpt?.slice(0, 140) ||
                "Read this Amazon buying guide with top deals, product reviews and smart shopping tips updated daily."}
            </p>

            {/* 📈 SCORE (hidden SEO signal for ranking UI) */}
            <p style={{ fontSize: 11, color: "#999" }}>
              Trending Score: {post.trendingScore || 0}
            </p>

            {/* 🔗 INTERNAL PRODUCT LINK */}
            {post.productId && (
              <Link href={`/product/${post.productId}`}>
                <p style={{ color: "blue", fontSize: 12 }}>
                  🔗 View Related Product
                </p>
              </Link>
            )}

            {/* 🚀 CTA BUTTONS */}
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
                    🛒 Buy
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

  /* ================= SEO RANKING ENGINE ================= */
  posts = posts.map((p) => {
    const created = p.createdAt?.toDate?.() || new Date();

    const hoursOld =
      (Date.now() - new Date(created).getTime()) /
      (1000 * 60 * 60);

    /* ================= 5 SEO BOOST FACTORS ================= */
    const freshnessBoost = Math.max(0, 30 - hoursOld * 1.2);
    const engagementBoost =
      (p.views || 0) * 2 +
      (p.likes || 0) * 3 +
      (p.clicks || 0) * 1.5;

    const viralBoost = p.auto ? 20 : 0;
    const contentBoost = (p.title?.length || 0) / 10;
    const authorityBoost = p.featured ? 25 : 0;

    return {
      ...p,
      trendingScore:
        freshnessBoost +
        engagementBoost +
        viralBoost +
        contentBoost +
        authorityBoost,
    };
  });

  /* ================= SORT ================= */
  posts.sort((a, b) => b.trendingScore - a.trendingScore);

  return {
    props: { posts },
  };
}
