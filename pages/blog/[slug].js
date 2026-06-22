import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= SAFE ================= */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (typeof v === "object") {
    return v?.text || v?.title || v?.value || v?.name || "";
  }
  return "";
};

const safeImage = (v) => {
  const fallback = "https://via.placeholder.com/1200x630?text=Koloonline";

  if (typeof v === "string") return v.startsWith("http") ? v : fallback;
  if (typeof v === "object" && v) {
    const img = v.url || v.image || v.src;
    return typeof img === "string" ? img : fallback;
  }
  return fallback;
};

const safeDate = (v) => {
  try {
    if (v?.toDate) return v.toDate().toISOString();
    return new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
};

/* ================= PAGE ================= */
export default function BlogPost({ post, relatedPosts }) {
  if (!post) return <div>Not Found</div>;

  const url = `https://koloonline.online/blog/${post.slug}`;

  return (
    <div>
      <Head>
        <title>{safeText(post.title)}</title>
        <meta name="description" content={safeText(post.excerpt)} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={safeText(post.title)} />
        <meta property="og:description" content={safeText(post.excerpt)} />
        <meta property="og:image" content={safeImage(post.image)} />

        {/* 🔥 FIXED SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: safeText(post.title),
              description: safeText(post.excerpt),
              image: safeImage(post.image),
              datePublished: safeDate(post.createdAt),
              author: {
                "@type": "Organization",
                name: "Koloonline",
              },
            }),
          }}
        />
      </Head>

      <article>
        <h1>{safeText(post.title)}</h1>

        <Image
          src={safeImage(post.image)}
          width={1200}
          height={630}
          alt={safeText(post.title)}
        />

        <div
          dangerouslySetInnerHTML={{
            __html: safeText(post.content),
          }}
        />
      </article>

      {relatedPosts?.map((p) => (
        <Link key={p.id} href={`/blog/${p.slug}`}>
          {safeText(p.title)}
        </Link>
      ))}
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps({ params }) {
  const snap = await getDocs(collection(db, "blog"));

  const posts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return { notFound: true };

  return {
    props: {
      post,
      relatedPosts: posts.slice(0, 4),
    },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "blog"));

  return {
    paths: snap.docs.map((d) => ({
      params: { slug: d.data()?.slug || d.id },
    })),
    fallback: "blocking",
  };
              }
