import Head from "next/head";
import Link from "next/link";

import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

import { db } from "../../config/firebase";

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

  const url =
    `https://koloonline.online/blog/${post.slug}`;

  /* ================= ARTICLE SCHEMA ================= */

  const articleSchema = {
    "@context": "https://schema.org",

    "@type": "Article",

    headline: post.title,

    description:
      post.excerpt ||
      post.title,

    image:
      post.image ||
      "https://via.placeholder.com/1200x630",

    author: {
      "@type": "Organization",
      name: "Koloonline",
    },

    publisher: {
      "@type": "Organization",

      name: "Koloonline",

      logo: {
        "@type": "ImageObject",

        url:
          "https://koloonline.online/logo.png",
      },
    },

    mainEntityOfPage: url,

    datePublished:
      post.createdAt || new Date(),

    dateModified:
      post.updatedAt ||
      post.createdAt ||
      new Date(),
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >

      {/* ================= SEO ================= */}

      <Head>

        <title>
          {post.title} |
          Koloonline
        </title>

        <meta
          name="description"
          content={
            post.excerpt ||
            post.title
          }
        />

        <meta
          name="keywords"
          content={
            post.keywords ||
            post.title
          }
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href={url}
        />

        {/* ================= OG ================= */}

        <meta
          property="og:type"
          content="article"
        />

        <meta
          property="og:title"
          content={post.title}
        />

        <meta
          property="og:description"
          content={
            post.excerpt ||
            post.title
          }
        />

        <meta
          property="og:url"
          content={url}
        />

        <meta
          property="og:image"
          content={
            post.image ||
            "https://via.placeholder.com/1200x630"
          }
        />

        {/* ================= TWITTER ================= */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        {/* ================= SCHEMA ================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                articleSchema
              ),
          }}
        />

      </Head>

      {/* ================= ARTICLE ================= */}

      <article
        style={{
          maxWidth: 900,
          margin: "auto",
          background: "white",
          padding: 25,
        }}
      >

        {/* ================= BADGE ================= */}

        {post.auto && (
          <span
            style={{
              background: "#0f9d58",
              color: "white",
              padding: "5px 10px",
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            🔥 AI Generated Article
          </span>
        )}

        {/* ================= TITLE ================= */}

        <h1
          style={{
            marginTop: 20,
            fontSize: 34,
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </h1>

        {/* ================= DATE ================= */}

        <p
          style={{
            color: "gray",
            marginBottom: 30,
          }}
        >
          Published by Koloonline
        </p>

        {/* ================= IMAGE ================= */}

        {post.image && (
          <img
            src={post.image}

            alt={post.title}

            loading="lazy"

            style={{
              width: "100%",
              borderRadius: 12,
              marginBottom: 30,
            }}
          />
        )}

        {/* ================= CONTENT ================= */}

        <div
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}

          style={{
            lineHeight: 1.9,
            fontSize: 18,
          }}
        />

      </article>

      {/* ================= RELATED PRODUCTS ================= */}

      {relatedProducts?.length > 0 && (

        <section
          style={{
            maxWidth: 1100,
            margin: "30px auto",
            padding: 20,
          }}
        >

          <h2>
            🛒 Related Products
          </h2>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",

              gap: 15,

              marginTop: 20,
            }}
          >

            {relatedProducts.map((p) => (

              <Link
                key={p.id}
                href={`/product/${p.id}`}
              >

                <div
                  style={{
                    background:
                      "white",

                    padding: 15,

                    borderRadius: 10,

                    cursor: "pointer",
                  }}
                >

                  <img
                    src={
                      p.image ||
                      "https://via.placeholder.com/300"
                    }

                    alt={p.title}

                    loading="lazy"

                    style={{
                      width: "100%",

                      height: 200,

                      objectFit:
                        "cover",

                      borderRadius: 8,
                    }}
                  />

                  <h3
                    style={{
                      fontSize: 16,
                    }}
                  >
                    {p.title}
                  </h3>

                  <p
                    style={{
                      color: "#B12704",

                      fontWeight:
                        "bold",
                    }}
                  >
                    ${p.price || 0}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </section>
      )}

      {/* ================= RELATED ARTICLES ================= */}

      {relatedPosts?.length > 0 && (

        <section
          style={{
            maxWidth: 1100,
            margin: "30px auto",
            padding: 20,
          }}
        >

          <h2>
            📚 Related Articles
          </h2>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",

              gap: 15,

              marginTop: 20,
            }}
          >

            {relatedPosts.map((p) => (

              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
              >

                <div
                  style={{
                    background:
                      "white",

                    padding: 15,

                    borderRadius: 10,

                    cursor: "pointer",
                  }}
                >

                  <h3>
                    {p.title}
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      fontSize: 14,
                    }}
                  >
                    {p.excerpt ||
                      "Read more..."}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </section>
      )}

    </div>
  );
}

/* ================= DATA ================= */

export async function getServerSideProps({
  params,
}) {

  try {

    const slug =
      params?.slug || "";

    /* ================= BLOG ================= */

    const blogSnap =
      await getDocs(
        query(
          collection(db, "blog"),

          where("slug", "==", slug),

          limit(1)
        )
      );

    if (blogSnap.empty) {

      return {
        notFound: true,
      };
    }

    const blogDoc =
      blogSnap.docs[0];

    const post = {
      id: blogDoc.id,
      ...blogDoc.data(),
    };

    /* ================= RELATED POSTS ================= */

    const relatedSnap =
      await getDocs(
        query(
          collection(db, "blog"),

          limit(6)
        )
      );

    const relatedPosts =
      relatedSnap.docs

        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))

        .filter(
          (p) =>
            p.slug !== slug
        )

        .slice(0, 4);

    /* ================= RELATED PRODUCTS ================= */

    let relatedProducts = [];

    if (
      post.relatedProducts?.length
    ) {

      const productsSnap =
        await getDocs(
          collection(
            db,
            "products"
          )
        );

      relatedProducts =
        productsSnap.docs

          .map((d) => ({
            id: d.id,
            ...d.data(),
          }))

          .filter((p) =>
            post.relatedProducts.includes(
              p.id
            )
          )

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

    console.log(e);

    return {
      notFound: true,
    };
  }
}
