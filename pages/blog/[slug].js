import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= SAFE ================= */
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
  const content = safeText(post.content);

  const image = safeImage(post.image);

  const url = `https://koloonline.online/blog/${post.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://koloonline.online",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://koloonline.online/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta
          name="description"
          content={excerpt}
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link rel="canonical" href={url} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        {/* ARTICLE SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: title,
              description: excerpt,
              image,
              datePublished: safeDate(post.createdAt),
              dateModified: safeDate(post.updatedAt),
              mainEntityOfPage: url,
              author: {
                "@type": "Organization",
                name: "Koloonline",
              },
              publisher: {
                "@type": "Organization",
                name: "Koloonline",
              },
            }),
          }}
        />

        {/* BREADCRUMB */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1>{title}</h1>

        <Image
          src={image}
          width={1200}
          height={630}
          alt={title}
          priority
        />

        <div
          style={{
            marginTop: "20px",
            lineHeight: "1.8",
          }}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />

        {/* INTERNAL LINKS */}
        <section style={{ marginTop: "40px" }}>
          <h2>Popular Shopping Guides</h2>

          <ul>
            <li>
              <Link href="/top/top-smart-watches">
                Top Smart Watches
              </Link>
            </li>

            <li>
              <Link href="/top/top-earbuds">
                Top Earbuds
              </Link>
            </li>

            <li>
              <Link href="/top/top-amazon-finds">
                Top Amazon Finds
              </Link>
            </li>

            <li>
              <Link href="/top/top-best-sellers">
                Amazon Best Sellers
              </Link>
            </li>

            <li>
              <Link href="/products">
                Browse Products
              </Link>
            </li>
          </ul>
        </section>

        {/* RELATED POSTS */}
        {relatedPosts?.length > 0 && (
          <section style={{ marginTop: "50px" }}>
            <h2>Related Articles</h2>

            <ul>
              {relatedPosts.map((p) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.slug}`}>
                    {safeText(p.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

/* ================= DATA ================= */
export async function getStaticProps({ params }) {
  try {
    const snap = await getDocs(
      collection(db, "blog")
    );

    const posts = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const post =
      posts.find(
        (p) => p.slug === params.slug
      ) || null;

    if (!post) {
      return {
        notFound: true,
      };
    }

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
  } catch {
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const snap = await getDocs(
      collection(db, "blog")
    );

    const paths = snap.docs.map((doc) => ({
      params: {
        slug:
          doc.data()?.slug || doc.id,
      },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
            }
