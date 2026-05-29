import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= ADSENSE BLOCK ================= */
function AdSenseBlock() {
  if (typeof window !== "undefined") {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        textAlign: "center",
        minHeight: "90px",
      }}
      data-ad-client="ca-pub-1294940976431468"
      data-ad-slot="auto"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

/* ================= READING TIME ================= */
function estimateReadingTime(text = "") {
  const words = text.replace(/<[^>]+>/g, "").split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ================= PAGE ================= */
export default function BlogPost({ post, relatedPosts, relatedProducts }) {
  if (!post) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Article Not Found</h1>
      </div>
    );
  }

  const url = `https://koloonline.online/blog/${post.slug}`;

  const readingTime = estimateReadingTime(post.content);

  const publishedTime = post.createdAt?.seconds
    ? new Date(post.createdAt.seconds * 1000).toISOString()
    : new Date().toISOString();

  const modifiedTime = post.updatedAt?.seconds
    ? new Date(post.updatedAt.seconds * 1000).toISOString()
    : publishedTime;

  /* ================= SCHEMA ================= */
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
      {/* ================= SEO ================= */}
      <Head>
        <title>{post.title} | Koloonline</title>

        <meta name="description" content={post.excerpt || post.title} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={url} />

        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={url} />

        <meta name="theme-color" content="#ff9900" />
        <meta name="author" content="Koloonline AI System" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      </Head>

      {/* ================= BREADCRUMB ================= */}
      <div style={{ maxWidth: 1100, margin: "auto", padding: 15 }}>
        <Link href="/">Home</Link> {" > "}
        <Link href="/blog">Blog</Link> {" > "}
        <span>{post.title}</span>
      </div>

      {/* ================= TOP AD ================= */}
      <div style={{ maxWidth: 900, margin: "10px auto" }}>
        <AdSenseBlock />
      </div>

      {/* ================= ARTICLE ================= */}
      <article
        style={{
          maxWidth: 900,
          margin: "auto",
          background: "white",
          padding: 25,
          borderRadius: 12,
        }}
      >
        {post.auto && (
          <span
            style={{
              background: "#0f9d58",
              color: "white",
              padding: 5,
              borderRadius: 8,
            }}
          >
            🔥 AI Generated Article
          </span>
        )}

        <h1 style={{ fontSize: 34 }}>{post.title}</h1>

        <p style={{ color: "gray" }}>
          ⏱ {readingTime} min read • Koloonline
        </p>

        {/* IMAGE OPTIMIZED */}
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={630}
            priority
            style={{ width: "100%", height: "auto", borderRadius: 12 }}
          />
        )}

        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontSize: 18, lineHeight: 1.9 }}
        />

        {/* ================= UX BOOST ================= */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            background: "#f1f1f1",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <h2>🧠 More Smart Shopping Guides</h2>
          <p>Explore trending Amazon deals</p>

          <Link href="/products">
            <button
              style={{
                marginTop: 10,
                padding: "10px 20px",
                background: "#ff9900",
                border: "none",
                borderRadius: 8,
              }}
            >
              Browse Deals →
            </button>
          </Link>
        </div>
      </article>

      {/* ================= MID AD ================= */}
      <div style={{ maxWidth: 900, margin: "30px auto" }}>
        <AdSenseBlock />
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts?.length > 0 && (
        <section style={{ maxWidth: 1100, margin: "30px auto" }}>
          <h2>🛒 Related Products</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 15,
            }}
          >
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div style={{ background: "white", padding: 15, borderRadius: 10 }}>
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                  />
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: 15,
            }}
          >
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

/* ================= STATIC OPTIMIZATION ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "blog"));

  const paths = snap.docs.map((doc) => ({
    params: { slug: doc.data().slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const postDoc = snap.docs.find(
      (d) => d.data().slug === params.slug
    );

    if (!postDoc) {
      return { props: { post: null, relatedPosts: [], relatedProducts: [] } };
    }

    const post = {
      id: postDoc.id,
      ...postDoc.data(),
    };

    const relatedPosts = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.slug !== params.slug)
      .slice(0, 4);

    const productsSnap = await getDocs(collection(db, "products"));

    const relatedProducts = productsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return {
      props: {
        post,
        relatedPosts,
        relatedProducts,
      },
      revalidate: 3600, // ISR = كل ساعة تحديث
    };
  } catch (e) {
    return {
      props: { post: null, relatedPosts: [], relatedProducts: [] },
      revalidate: 60,
    };
  }
      }
