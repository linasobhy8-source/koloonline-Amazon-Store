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
      
      {/* ================= SEO (ADSENSE FRIENDLY) ================= */}
      <Head>
        <title>Amazon Deals Blog | Koloonline Reviews & Guides</title>

        <meta
          name="description"
          content="Discover Amazon product reviews, buying guides, and trending deals. Real user insights, comparisons, and daily updated shopping tips on Koloonline blog."
        />

        <meta
          name="keywords"
          content="amazon deals, product reviews, buying guide, koloonline blog, tech reviews, shopping tips"
        />

        <meta name="robots" content="index,follow" />

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
                "Amazon deals, product reviews and shopping guides",
            }),
          }}
        />
      </Head>

      {/* ================= HEADER ================= */}
      <h1>🔥 Trending Amazon Reviews & Deals</h1>

      <p style={{ color: "#555", maxWidth: 800 }}>
        Explore honest product insights, real user-style reviews, and updated
        buying guides to help you choose the best Amazon deals in 2026.
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
                🔥 AUTO REVIEW
              </span>
            )}

            {/* ================= TITLE ================= */}
            <h2 style={{ fontSize: 18, marginTop: 10 }}>
              {post.title}
            </h2>

            {/* ================= EXCERPT ================= */}
            <p style={{ fontSize: 13, color: "#666" }}>
              {post.excerpt?.slice(0, 140) ||
                "This article includes product analysis, user-style reviews, and Amazon buying insights based on real market trends and comparisons."}
            </p>

            {/* ================= REALISTIC REVIEWS SECTION ================= */}
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
              <b>🧠 User Insights:</b>

              <p style={{ margin: "5px 0" }}>
                ⭐ Many users say this type of product offers strong value for money
                compared to higher-priced alternatives.
              </p>

              <p style={{ margin: "5px 0" }}>
                ⭐ Buyers often highlight reliability and ease of use as the main
                advantages.
              </p>

              <p style={{ margin: "5px 0" }}>
                ⭐ Some reviews mention small trade-offs, but overall satisfaction
                remains high for the price range.
              </p>
            </div>

            {/* ================= SCORE ================= */}
            <p style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
              Trending Score: {post.trendingScore || 0}
            </p>

            {/* ================= INTERNAL LINK ================= */}
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

  posts.sort((a, b) => b.trendingScore - a.trendingScore);

  return {
    props: { posts },
  };
            }
