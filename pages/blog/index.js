import Head from "next/head";
import Link from "next/link";
import { db } from "../../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Blog({ posts }) {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <Head>
        <title>Blog | Koloonline Amazon Deals</title>

        <meta
          name="description"
          content="Discover Amazon guides, reviews, and trending deals on Koloonline blog."
        />

        <link
          rel="canonical"
          href="https://koloonline.online/blog"
        />
      </Head>

      <h1>🔥 Trending Blog Articles</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: 20,
        marginTop: 20
      }}>

        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "white",
              padding: 15,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >

            {/* 🔥 Auto blog badge */}
            {post.auto && (
              <span style={{
                background: "green",
                color: "white",
                padding: "3px 8px",
                fontSize: 11,
                borderRadius: 8
              }}>
                🔥 AUTO BLOG
              </span>
            )}

            <h2 style={{ fontSize: 18, marginTop: 10 }}>
              {post.title}
            </h2>

            <p style={{ fontSize: 13, color: "#666" }}>
              {post.excerpt || "Read full article about Amazon deals and trends."}
            </p>

            <Link href={`/blog/${post.id}`}>
              <button
                style={{
                  marginTop: 10,
                  padding: "10px 15px",
                  background: "#ff9900",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                📖 Read Article
              </button>
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SEO DATA ================= */
export async function getServerSideProps() {
  const snap = await getDocs(
    query(collection(db, "blog"), orderBy("createdAt", "desc"))
  );

  let posts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  /* ================= SEO BOOST ================= */
  posts = posts.map((p) => {
    const created = p.createdAt?.toDate?.() || new Date();

    const hoursOld =
      (Date.now() - new Date(created).getTime()) / (1000 * 60 * 60);

    return {
      ...p,
      trendingScore:
        (p.views || 0) * 2 +
        (p.likes || 0) * 3 +
        (hoursOld < 24 ? 20 : 0),
    };
  });

  /* ترتيب ذكي */
  posts.sort((a, b) => b.trendingScore - a.trendingScore);

  return {
    props: { posts },
  };
                  }
