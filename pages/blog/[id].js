import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

/* ================= ARTICLE ================= */
export default function Article({ post, relatedProducts }) {
  if (!post) return <p>Not found</p>;

  const title = `${post.title} | Koloonline`;
  const description = post.description || post.title;
  const url = `https://koloonline.online/blog/${post.id}`;
  const image = post.image || "https://koloonline.online/og-image.jpg";

  /* ================= INTERNAL LINKS BOOST ================= */
  const [internalLinks, setInternalLinks] = useState([]);

  useEffect(() => {
    fetch("/api/seo/boost")
      .then((res) => res.json())
      .then((data) => {
        const match = data.boostMap?.find(
          (x) => x.page === window.location.href
        );

        if (match) setInternalLinks(match.internalLinks || []);
      })
      .catch(() => {});
  }, []);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    url,
    image,
    author: { "@type": "Organization", name: "Koloonline" },
    publisher: { "@type": "Organization", name: "Koloonline" },
  };

  /* ================= AUTO INDEXING ================= */
  useEffect(() => {
    if (!post?.id) return;

    const timer = setTimeout(() => {
      fetch("/api/instant-index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }).catch(() => {});
    }, 8000);

    return () => clearTimeout(timer);
  }, [post?.id, url]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 900, margin: "auto" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />

        {/* Schema */}
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
            src={image}
            alt={post.title}
            style={{ width: "100%", marginTop: 20, borderRadius: 10 }}
          />
        )}

        <p style={{ marginTop: 20, fontSize: 18, color: "#555" }}>
          {description}
        </p>

        <div style={{ whiteSpace: "pre-line", marginTop: 20, lineHeight: 1.7 }}>
          {post.content}
        </div>

        {/* ================= CONTENT BOOST ================= */}
        <section style={{ marginTop: 40 }}>
          <h2>Best Amazon Deals 2026</h2>

          <p>
            Koloonline is a smart shopping platform that helps users discover trending Amazon products,
            best deals, viral gadgets, and buying guides updated daily with real data-driven insights.
          </p>

          <p>
            We analyze product performance, conversion rates, and popularity to recommend the best items
            for tech, home, fitness, and lifestyle categories.
          </p>
        </section>
      </article>

      {/* ================= INTERNAL LINKS (NEW SEO LAYER) ================= */}
      {internalLinks.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2>🔗 Related Internal Pages</h2>
          <ul>
            {internalLinks.map((link, i) => (
              <li key={i}>
                <a href={link.url}>{link.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

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
              alt={p.title}
              style={{ width: "100%", height: 160, objectFit: "cover" }}
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

      {/* ================= RELATED GUIDES ================= */}
      <section style={{ marginTop: 40 }}>
        <h2>📚 Related Guides</h2>

        <ul>
          <li><a href="/blog/best-smart-watches">Best Smart Watches 2026</a></li>
          <li><a href="/blog/best-headphones-2026">Best Headphones</a></li>
          <li><a href="/blog/viral-products-amazon">Viral Amazon Products</a></li>
        </ul>
      </section>

      {/* ================= CTA ================= */}
      <div style={{ marginTop: 50, textAlign: "center" }}>
        <a href="https://www.amazon.com?tag=koloonlinesto-20" target="_blank" rel="noopener noreferrer">
          <button style={{
            padding: 15,
            background: "linear-gradient(#ff9900,#ff6600)",
            border: "none",
            color: "#fff",
            fontSize: 16,
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

  if (!snap.exists()) return { notFound: true };

  const post = { id: snap.id, ...snap.data() };

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
