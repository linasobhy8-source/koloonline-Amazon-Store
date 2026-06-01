import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= READING TIME ================= */
function estimateReadingTime(text = "") {
  const words = text.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost({ post, relatedPosts, relatedProducts }) {
  if (!post) return <div style={{ padding: 20 }}>Article Not Found</div>;

  const url = `https://koloonline.online/blog/${post.slug}`;
  const readingTime = estimateReadingTime(post.content || "");

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>
      
      {/* ================= SEO ================= */}
      <Head>
        <title>{post.title} | Koloonline</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:image" content={post.image || ""} />
      </Head>

      {/* ================= ADSENSE SCRIPT (IMPORTANT) ================= */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1294940976431468"
        crossOrigin="anonymous"
      />

      {/* ================= ARTICLE ================= */}
      <article style={{ maxWidth: 900, margin: "auto", background: "#fff", padding: 20 }}>
        <h1>{post.title}</h1>
        <p>⏱ {readingTime} min read</p>

        {post.image && (
          <Image
            src={post.image}
            width={1200}
            height={630}
            alt={post.title}
            style={{ width: "100%", height: "auto" }}
          />
        )}

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* ================= RELATED ================= */}
      <section style={{ maxWidth: 900, margin: "30px auto" }}>
        <h2>Related Posts</h2>
        {relatedPosts?.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`}>
            <p>{p.title}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

/* ================= STATIC ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "blog"));

  return {
    paths: snap.docs.map((d) => ({
      params: { slug: d.data().slug },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const snap = await getDocs(collection(db, "blog"));

  const postDoc = snap.docs.find((d) => d.data().slug === params.slug);

  if (!postDoc) return { notFound: true };

  const post = { id: postDoc.id, ...postDoc.data() };

  const relatedPosts = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.slug !== params.slug)
    .slice(0, 4);

  return {
    props: { post, relatedPosts, relatedProducts: [] },
    revalidate: 3600,
  };
        }
