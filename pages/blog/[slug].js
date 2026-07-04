import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= CONFIG ================= */
const SITE_URL = "https://koloonline.online";

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v == null) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    return v?.text || v?.title || v?.value || v?.name || "";
  }

  return "";
};

const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/1200x630?text=Koloonline";

  if (typeof v === "string") {
    return v.startsWith("http") ? v : fallback;
  }

  if (v && typeof v === "object") {
    const img = v.url || v.image || v.src;
    return typeof img === "string" ? img : fallback;
  }

  return fallback;
};

const safeDate = (v) => {
  try {
    if (v?.toDate) return v.toDate().toISOString();
    return new Date(v || Date.now()).toISOString();
  } catch {
    return new Date().toISOString();
  }
};

/* ================= PAGE ================= */
export default function BlogPost({ post, relatedPosts }) {
  if (!post) return <div>Not Found</div>;

  const title = safeText(post.title);
  const excerpt = safeText(post.excerpt);
  const image = safeImage(post.image);

  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={image} />

        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: title,
              description: excerpt,
              image: [image],
              datePublished: safeDate(post.createdAt),
              dateModified: safeDate(post.updatedAt),
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
              author: { "@type": "Organization", name: "Koloonline" },
              publisher: {
                "@type": "Organization",
                name: "Koloonline",
                logo: {
                  "@type": "ImageObject",
                  url: SITE_URL + "/logo.png",
                },
              },
              inLanguage: "en",
            }),
          }}
        />
      </Head>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <article>
          <h1>{title}</h1>

          <Image
            src={image}
            width={1200}
            height={630}
            alt={title}
            priority
          />

          <div
            dangerouslySetInnerHTML={{
              __html: safeText(post.content),
            }}
            style={{ marginTop: 20, lineHeight: 1.8 }}
          />
        </article>

        {/* RELATED POSTS */}
        {relatedPosts?.length > 0 && (
          <section style={{ marginTop: 50 }}>
            <h2>Related Articles</h2>
            {relatedPosts.map((p) => (
              <div key={p.id} style={{ marginBottom: 15 }}>
                <Link href={`/blog/${p.slug}`}>
                  {safeText(p.title)}
                </Link>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const post =
      posts.find((p) => p.slug === params.slug) || null;

    if (!post) return { notFound: true };

    const relatedPosts = posts
      .filter((p) => p.slug !== post.slug)
      .slice(0, 6);

    return {
      props: {
        post,
        relatedPosts,
      },
      revalidate: 3600,
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const paths = snap.docs.map((doc) => ({
      params: { slug: doc.data().slug || doc.id },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (e) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
