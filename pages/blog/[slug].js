import Head from "next/head";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

import { db } from "../../config/firebase";

/* ================= AD COMPONENT ================= */
function AdSenseBlock() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center" }}
      data-ad-client="ca-pub-1294940976431468"
      data-ad-slot="auto"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

/* ================= HELPERS ================= */
function estimateReadingTime(text = "") {
  const words = text.replace(/<[^>]+>/g, "").split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ================= PAGE ================= */
export default function BlogPost({
  post,
  relatedPosts,
  relatedProducts,
}) {
  if (!post) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Article Not Found</h1>
      </div>
    );
  }

  const url = `https://koloonline.online/blog/${post.slug}`;

  const readingTime = useMemo(
    () => estimateReadingTime(post.content),
    [post.content]
  );

  const publishedTime = new Date(
    post.createdAt?.seconds * 1000 || Date.now()
  ).toISOString();

  const modifiedTime = new Date(
    post.updatedAt?.seconds * 1000 || post.createdAt?.seconds * 1000 || Date.now()
  ).toISOString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.image || "https://via.placeholder.com/1200x630",
    author: { "@type": "Organization", name: "Koloonline" },
    publisher: {
      "@type": "Organization",
      name: "Koloonline",
      logo: {
        "@type": "ImageObject",
        url: "https://koloonline.online/logo.png",
      },
    },
    mainEntityOfPage: url,
    datePublished: publishedTime,
    dateModified: modifiedTime,
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= SEO + DISCOVER ================= */}
      <Head>
        <title>{post.title} | Koloonline</title>

        <meta name="description" content={post.excerpt || post.title} />

        {/* SEO CORE */}
        <meta name="author" content="Koloonline" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1" />

        {/* DISCOVER / NEWS BOOST */}
        <meta property="article:published_time" content={publishedTime} />
        <meta property="article:modified_time" content={modifiedTime} />

        <meta name="news_keywords" content={post.keywords || post.title} />

        {/* OG */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={url} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Canonical */}
        <link rel="canonical" href={url} />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      </Head>

      {/* ================= BREADCRUMB ================= */}
      <div style={{ maxWidth: 1100, margin: "auto", padding: 15, fontSize: 14 }}>
        <Link href="/">Home</Link> {" > "}
        <Link href="/blog">Blog</Link> {" > "}
        <span>{post.title}</span>
      </div>

      {/* ================= TOP AD ================= */}
      <div style={{ maxWidth: 900, margin: "10px auto" }}>
        <AdSenseBlock />
      </div>

      {/* ================= ARTICLE ================= */}
      <article style={{ maxWidth: 900, margin: "auto", background: "white", padding: 25 }}>

        {post.auto && (
          <span style={{ background: "#0f9d58", color: "white", padding: "5px 10px", borderRadius: 8 }}>
            🔥 AI Generated Article
          </span>
        )}

        <h1 style={{ fontSize: 34, marginTop: 20 }}>{post.title}</h1>

        <p style={{ color: "gray" }}>
          Published • {readingTime} min read
        </p>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", borderRadius: 12, margin: "20px 0" }}
          />
        )}

        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontSize: 18, lineHeight: 1.9 }}
        />
      </article>

      {/* ================= MIDDLE AD ================= */}
      <div style={{ maxWidth: 900, margin: "30px auto" }}>
        <AdSenseBlock />
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts?.length > 0 && (
        <section style={{ maxWidth: 1100, margin: "30px auto" }}>
          <h2>🛒 Related Products</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 15 }}>
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div style={{ background: "white", padding: 15, borderRadius: 10 }}>
                  <img src={p.image} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                  <h3>{p.title}</h3>
                  <p style={{ color: "#B12704" }}>${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= RELATED POSTS ================= */}
      {relatedPosts?.length > 0 && (
        <section style={{ maxWidth: 1100, margin: "30px auto" }}>
          <h2>📚 Related Articles</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 15 }}>
            {relatedPosts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}>
                <div style={{ background: "white", padding: 15, borderRadius: 10 }}>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= BOTTOM AD ================= */}
      <div style={{ maxWidth: 900, margin: "40px auto" }}>
        <AdSenseBlock />
      </div>
    </div>
  );
}

/* ================= DATA ================= */
export async function getServerSideProps({ params }) {
  try {
    const slug = params?.slug || "";

    const blogSnap = await getDocs(
      query(collection(db, "blog"), where("slug", "==", slug), limit(1))
    );

    if (blogSnap.empty) return { notFound: true };

    const post = {
      id: blogSnap.docs[0].id,
      ...blogSnap.docs[0].data(),
    };

    const relatedSnap = await getDocs(
      query(collection(db, "blog"), limit(6))
    );

    const relatedPosts = relatedSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.slug !== slug)
      .slice(0, 4);

    let relatedProducts = [];

    if (post.relatedProducts?.length) {
      const productsSnap = await getDocs(collection(db, "products"));

      relatedProducts = productsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => post.relatedProducts.includes(p.id))
        .slice(0, 6);
    }

    return {
      props: {
        post,
        relatedPosts,
        relatedProducts,
      },
    };
  } catch (e) {
    return { notFound: true };
  }
                                                        }
