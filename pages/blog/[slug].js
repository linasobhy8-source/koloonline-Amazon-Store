import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= READING TIME ================= */
function estimateReadingTime(text = "") {
  const cleanText = text.replace(/<[^>]+>/g, "");
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ================= PAGE ================= */
export default function BlogPost({ post, relatedPosts }) {
  if (!post) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial" }}>
        <h1>Article Not Found</h1>
        <Link href="/blog">Go Back</Link>
      </div>
    );
  }

  const url = `https://koloonline.online/blog/${post.slug}`;
  const readingTime = estimateReadingTime(post.content || "");

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* ================= SEO ================= */}
      <Head>
        <title>{post.title} | Koloonline</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:image" content={post.image || ""} />
        <meta property="og:url" content={url} />
      </Head>

      {/* ================= ADS SCRIPT ================= */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
        crossOrigin="anonymous"
      />

      {/* ================= ARTICLE ================= */}
      <article
        style={{
          maxWidth: 900,
          margin: "auto",
          background: "#fff",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <h1>{post.title}</h1>

        <p style={{ color: "#666" }}>⏱ {readingTime} min read</p>

        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={630}
            style={{ width: "100%", height: "auto" }}
          />
        )}

        <div
          style={{ marginTop: 20 }}
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </article>

      {/* ================= RELATED POSTS ================= */}
      <section style={{ maxWidth: 900, margin: "30px auto" }}>
        <h2>🔥 Related Posts</h2>

        {relatedPosts?.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`}>
            <div style={{ padding: 10, background: "#fff", marginTop: 10 }}>
              {p.title}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "blog"));

  const paths = snap.docs.map((d) => {
    const data = d.data();
    return {
      params: { slug: data.slug || d.id },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  const snap = await getDocs(collection(db, "blog"));

  const posts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return { notFound: true };
  }

  const relatedPosts = posts
    .filter((p) => p.slug !== params.slug)
    .slice(0, 4);

  return {
    props: {
      post,
      relatedPosts,
    },
    revalidate: 3600,
  };
        }
