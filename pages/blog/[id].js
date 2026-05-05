import Head from "next/head";
import { db } from "../../config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

/* ================= ARTICLE ================= */
export default function Article({ post, relatedProducts }) {
  if (!post) return <p>Not found</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      {/* SEO */}
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
      </Head>

      {/* ARTICLE */}
      <h1>{post.title}</h1>

      <div style={{ whiteSpace: "pre-line", marginTop: 20 }}>
        {post.content}
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      <h2 style={{ marginTop: 40 }}>🔥 Products Related to This Article</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 15,
        marginTop: 20
      }}>
        {relatedProducts.map((p) => (
          <div key={p.id} style={{
            background: "#fff",
            padding: 10,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <img
              src={p.image}
              style={{ width: "100%", height: 160, objectFit: "cover" }}
            />

            <h4>{p.title}</h4>
            <p style={{ color: "#B12704" }}>${p.price}</p>

            <a href={p.link} target="_blank">
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

      {/* ================= MAIN CTA ================= */}
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <a href="https://www.amazon.com?tag=koloonlinesto-20" target="_blank">
          <button style={{
            padding: 15,
            background: "linear-gradient(#ff9900,#ff6600)",
            border: "none",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer"
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

  /* ================= GET PRODUCTS ================= */
  const productsSnap = await getDocs(collection(db, "products"));

  const products = productsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  /* ================= SMART MATCHING ================= */
  const keywords = (post.title + " " + (post.content || ""))
    .toLowerCase()
    .split(" ");

  const relatedProducts = products
    .map((p) => {
      let score = 0;

      keywords.forEach((k) => {
        if (p.title?.toLowerCase().includes(k)) score += 3;
        if (p.category?.toLowerCase().includes(k)) score += 2;
      });

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
