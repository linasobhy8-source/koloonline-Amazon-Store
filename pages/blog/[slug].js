import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

import { db } from "../../config/firebase";

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.image || "https://via.placeholder.com/1200x630",
    author: {
      "@type": "Organization",
      name: "Koloonline",
    },
    publisher: {
      "@type": "Organization",
      name: "Koloonline",
      logo: {
        "@type": "ImageObject",
        url: "https://koloonline.online/logo.png",
      },
    },
    mainEntityOfPage: url,
    datePublished: new Date(post.createdAt?.seconds * 1000 || Date.now()).toISOString(),
    dateModified: new Date(post.updatedAt?.seconds * 1000 || Date.now()).toISOString(),
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{post.title} | Koloonline</title>

        <meta name="description" content={post.excerpt || post.title} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />

        {/* OG */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={url} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      </Head>

      {/* ================= BREADCRUMB (SEO) ================= */}
      <div style={{ maxWidth: 1100, margin: "auto", padding: "15px 20px", fontSize: 14 }}>
        <Link href="/">Home</Link> {" > "}
        <Link href="/blog">Blog</Link> {" > "}
        <span>{post.title}</span>
      </div>

      {/* ================= AD SLOT (TOP) ================= */}
      <div style={{ maxWidth: 900, margin: "10px auto", textAlign: "center" }}>
        {/* Google AdSense Top */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="pub-1294940976431468"
          data-ad-slot="auto"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* ================= ARTICLE ================= */}
      <article style={{ maxWidth: 900, margin: "auto", background: "white", padding: 25 }}>

        {/* BADGE */}
        {post.auto && (
          <span style={{ background: "#0f9d58", color: "white", padding: "5px 10px", borderRadius: 8 }}>
            🔥 AI Generated Article
          </span>
        )}

        {/* TITLE */}
        <h1 style={{ fontSize: 34, marginTop: 20 }}>{post.title}</h1>

        {/* META */}
        <p style={{ color: "gray" }}>
          Published • {readingTime} min read
        </p>

        {/* IMAGE */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            style={{ width: "100%", borderRadius: 12, margin: "20px 0" }}
          />
        )}

        {/* CONTENT */}
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontSize: 18, lineHeight: 1.9 }}
        />

      </article>

      {/* ================= AD SLOT (MIDDLE) ================= */}
      <div style={{ maxWidth: 900, margin: "30px auto", textAlign: "center" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="pub-1294940976431468"
          data-ad-slot="auto"
          data-ad-format="fluid"
        />
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

      {/* ================= AD SLOT (BOTTOM) ================= */}
      <div style={{ maxWidth: 900, margin: "40px auto", textAlign: "center" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="pub-1294940976431468"
          data-ad-slot="auto"
        />
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

    const relatedSnap = await getDocs(query(collection(db, "blog"), limit(6)));

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
