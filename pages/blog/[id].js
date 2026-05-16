import Head from "next/head";
import { db } from "../../config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

/* ================= ARTICLE ================= */
export default function Article({ post, relatedProducts }) {
  if (!post) return <p>Not found</p>;

  const title = `${post.title} | Koloonline`;
  const description = post.description || post.title;
  const url = `https://koloonline.online/blog/${post.id}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: description,
    url: url,
    image: post.image || "https://koloonline.online/og-image.jpg",
    author: {
      "@type": "Organization",
      name: "Koloonline",
    },
    publisher: {
      "@type": "Organization",
      name: "Koloonline",
    },
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 900, margin: "auto" }}>

      {/* ================= SEO HEAD (FULL FIX) ================= */}
      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={post.image} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={post.image} />

        {/* IMPORTANT FOR INDEXING */}
        <meta name="robots" content="index, follow" />

        {/* SCHEMA (Rich Results) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </Head>

      {/* ================= ARTICLE ================= */}
      <article>

        <h1 style={{ fontSize: 28 }}>{post.title}</h1>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", marginTop: 20, borderRadius: 10 }}
          />
        )}

        <p style={{ marginTop: 20, fontSize: 18, color: "#555" }}>
          {post.description}
        </p>

        <div style={{ whiteSpace: "pre-line", marginTop: 20, lineHeight: 1.7 }}>
          {post.content}
        </div>

        {/* ================= KEY TAKEAWAYS ================= */}
        <h2 style={{ marginTop: 40 }}>Key Takeaways</h2>
        <ul>
          <li>High value insights from this article</li>
          <li>Practical tips you can apply immediately</li>
          <li>Recommended Amazon products inside</li>
        </ul>

        {/* ================= FAQ ================= */}
        <h2 style={{ marginTop: 40 }}>FAQ</h2>
        <p><strong>Q: Is this article helpful?</strong></p>
        <p>A: Yes, it provides practical buying and usage insights.</p>

      </article>

      {/* ================= RELATED PRODUCTS ================= */}
      <h2 style={{ marginTop: 50 }}>🔥 Related Products</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 15,
        marginTop: 20
      }}>
        {relatedProducts?.map((p) => (
          <div key={p.id} style={{
            background: "#fff",
            padding: 10,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>

            <img
              src={p.image}
              style={{ width: "100%", height: 160, objectFit: "cover" }}
              alt={p.title}
            />

            <h4>{p.title}</h4>
            <p style={{ color: "#B12704" }}>${p.price}</p>

            <a href={p.link} target="_blank" rel="noopener noreferrer">
              <button style={{
                width: "100%",
                padding: 10,
                background: "#ff9900",
                border: "none",
                cursor: "pointer"
              }}>
                🛒 Buy Now
              </button>
            </a>
          </div>
        ))}
      </div>

      {/* ================= CTA ================= */}
      <div style={{ marginTop: 50, textAlign: "center" }}>
        <a
          href="https://www.amazon.com?tag=koloonlinesto-20"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={{
            padding: 15,
            background: "linear-gradient(#ff9900,#ff6600)",
            border: "none",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            borderRadius: 8
          }}>
            🚀 Shop All Recommended Products
          </button>
        </a>
      </div>

    </div>
  );
}

/* ================= SSR ================= */
export async function getServerSideProps({ params }) {
  const docRef = doc(db, "blog", params.id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    return { notFound: true };
  }

  const post = {
    id: snap.id,
    ...snap.data(),
  };

  const productsSnap = await getDocs(collection(db, "products"));

  const products = productsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const text = ((post.title || "") + " " + (post.content || "")).toLowerCase();

  const relatedProducts = products
    .map((p) => {
      let score = 0;

      const title = (p.title || "").toLowerCase();
      const category = (p.category || "").toLowerCase();

      if (text.includes(title)) score += 5;
      if (text.includes(category)) score += 3;

      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    props: {
      post,
      relatedProducts,
    },
  };
        }
