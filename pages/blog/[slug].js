import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= CONFIG ================= */

const SITE_URL = "https://koloonline.online";

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
    return (
      v?.text ||
      v?.title ||
      v?.value ||
      v?.name ||
      ""
    );
  }

  return "";
};

const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/1200x630?text=Koloonline";

  if (typeof v === "string") {
    return v.startsWith("http")
      ? v
      : fallback;
  }

  if (v && typeof v === "object") {
    const img =
      v.url ||
      v.image ||
      v.src;

    return typeof img === "string"
      ? img
      : fallback;
  }

  return fallback;
};

const safeDate = (v) => {
  try {
    if (v?.toDate)
      return v.toDate().toISOString();

    return new Date(
      v || Date.now()
    ).toISOString();
  } catch {
    return new Date().toISOString();
  }
};

/* ================= PAGE ================= */

export default function BlogPost({
  post,
  relatedPosts,
}) {
  if (!post) return <div>Not Found</div>;

  const title = safeText(post.title);
  const excerpt = safeText(post.excerpt);
  const content = safeText(post.content);

  const image = safeImage(post.image);

  const url = `${SITE_URL}/blog/${post.slug}`;

  const keywords = Array.isArray(post.tags)
    ? post.tags.join(", ")
    : "";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
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
          name="keywords"
          content={keywords}
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href={url}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="article"
        />

        <meta
          property="og:title"
          content={title}
        />

        <meta
          property="og:description"
          content={excerpt}
        />

        <meta
          property="og:url"
          content={url}
        />

        <meta
          property="og:image"
          content={image}
        />

        <meta
          property="og:image:width"
          content="1200"
        />

        <meta
          property="og:image:height"
          content="630"
        />

        <meta
          property="article:published_time"
          content={safeDate(post.createdAt)}
        />

        <meta
          property="article:modified_time"
          content={safeDate(post.updatedAt)}
        />
                    {/* ================= TWITTER ================= */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={title}
        />

        <meta
          name="twitter:description"
          content={excerpt}
        />

        <meta
          name="twitter:image"
          content={image}
        />

        {/* ================= ARTICLE SCHEMA ================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "Article",

              headline: title,

              description: excerpt,

              image: [image],

              datePublished: safeDate(
                post.createdAt
              ),

              dateModified: safeDate(
                post.updatedAt
              ),

              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": url,
              },

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
                    SITE_URL +
                    "/logo.png",
                },
              },

              keywords,

              articleSection:
                safeText(
                  post.category
                ) || "Shopping",

              inLanguage: "en",
            }),
          }}
        />

        {/* ================= WEBPAGE SCHEMA ================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context":
                "https://schema.org",

              "@type": "WebPage",

              name: title,

              url,

              description: excerpt,

              isPartOf: {
                "@type": "WebSite",

                name: "Koloonline",

                url: SITE_URL,
              },

              primaryImageOfPage: image,

              inLanguage: "en",
            }),
          }}
        />

        {/* ================= BREADCRUMB ================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbSchema
            ),
          }}
        />

      </Head>      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <article>

          <header>

            <h1>{title}</h1>

            <p
              style={{
                color: "#666",
                marginBottom: "20px",
              }}
            >
              Last updated:
              {" "}
              {new Date(
                safeDate(post.updatedAt)
              ).toLocaleDateString()}
            </p>

            <Image
              src={image}
              width={1200}
              height={630}
              alt={title}
              priority
              sizes="(max-width:768px) 100vw, 1200px"
            />

          </header>

          <section
            style={{
              marginTop: "25px",
              lineHeight: "1.9",
              fontSize: "18px",
            }}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />

        </article>

        {/* ================= INTERNAL SEO ================= */}

        <section
          style={{
            marginTop: "50px",
          }}
        >

          <h2>
            Popular Shopping Guides
          </h2>

          <ul>

            <li>
              <Link href="/products">
                Browse Products
              </Link>
            </li>

            <li>
              <Link href="/categories">
                Browse Categories
              </Link>
            </li>

            <li>
              <Link href="/amazon-haul">
                Amazon Haul
              </Link>
            </li>

            <li>
              <Link href="/top/top-smart-watches">
                Best Smart Watches
              </Link>
            </li>

            <li>
              <Link href="/top/top-earbuds">
                Best Earbuds
              </Link>
            </li>

            <li>
              <Link href="/top/top-best-sellers">
                Amazon Best Sellers
              </Link>
            </li>

            <li>
              <Link href="/blog">
                More Shopping Guides
              </Link>
            </li>

          </ul>

        </section>
        {/* ================= RELATED ARTICLES ================= */}

        {relatedPosts?.length > 0 && (
          <section
            style={{
              marginTop: "60px",
            }}
          >
            <h2>Related Articles</h2>

            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {relatedPosts.map((p) => (
                <article
                  key={p.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    padding: "15px",
                  }}
                >
                  <Link href={`/blog/${p.slug}`}>
                    <h3>
                      {safeText(p.title)}
                    </h3>
                  </Link>

                  <p>
                    {safeText(
                      p.excerpt
                    ).slice(0, 160)}
                  </p>

                  <Link
                    href={`/blog/${p.slug}`}
                  >
                    Read Article →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= DISCOVER BOOST ================= */}

        <section
          style={{
            marginTop: "60px",
            padding: "25px",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          <h2>
            Discover More Amazon Deals
          </h2>

          <p>
            Explore our latest buying
            guides, product reviews,
            trending Amazon finds,
            best sellers and hidden
            deals updated regularly.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <Link href="/products">
              Products
            </Link>

            <Link href="/categories">
              Categories
            </Link>

            <Link href="/blog">
              Blog
            </Link>

            <Link href="/amazon-haul">
              Amazon Haul
            </Link>

            <Link href="/top/top-smart-watches">
              Smart Watches
            </Link>

            <Link href="/top/top-earbuds">
              Earbuds
            </Link>
          </div>
        </section>

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

    /* ================= AI RELATED POSTS ================= */

    const relatedPosts = posts
      .filter((p) => {
        if (p.slug === post.slug) return false;

        const sameCategory =
          safeText(p.category) ===
          safeText(post.category);

        const sameTags =
          Array.isArray(p.tags) &&
          Array.isArray(post.tags) &&
          p.tags.some((t) =>
            post.tags.includes(t)
          );

        return sameCategory || sameTags;
      })
      .sort((a, b) => {
        const av =
          Number(a.views || 0) +
          Number(a.clicks || 0);

        const bv =
          Number(b.views || 0) +
          Number(b.clicks || 0);

        return bv - av;
      })
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

    return {
      notFound: true,
    };
  }
}
/* ================= STATIC PATHS ================= */

export async function getStaticPaths() {
  try {
    const snap = await getDocs(
      collection(db, "blog")
    );

    const paths = snap.docs
      .map((doc) => {
        const data = doc.data() || {};

        const slug = safeText(data.slug);

        if (!slug) return null;

        return {
          params: {
            slug,
          },
        };
      })
      .filter(Boolean);

    return {
      paths,

      // يسمح بإنشاء المقالات الجديدة فورًا عند أول زيارة
      fallback: "blocking",
    };
  } catch (e) {
    console.error("getStaticPaths:", e);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
        {/* ================= EXTRA SEO ================= */}

        <meta property="og:site_name" content="Koloonline" />
        <meta property="og:locale" content="en_US" />

        <meta
          property="article:published_time"
          content={safeDate(post.createdAt)}
        />

        <meta
          property="article:modified_time"
          content={safeDate(post.updatedAt)}
        />

        <meta
          property="article:author"
          content="Koloonline"
        />

        <meta
          property="article:section"
          content="Shopping Guides"
        />

        {(post.tags || []).map((tag, i) => (
          <meta
            key={i}
            property="article:tag"
            content={safeText(tag)}
          />
        ))}

        <meta
          name="twitter:title"
          content={title}
        />

        <meta
          name="twitter:description"
          content={excerpt}
        />

        <meta
          name="twitter:image"
          content={image}
        />

        <meta
          name="theme-color"
          content="#ff9900"
        />

        <meta
          name="author"
          content="Koloonline"
        />

        <meta
          name="publisher"
          content="Koloonline"
        />

        <link
          rel="alternate"
          hrefLang="en"
          href={url}
        />

        <link
          rel="alternate"
          hrefLang="x-default"
          href={url}
        />

        <link
          rel="preload"
          as="image"
          href={image}
        />
            }

/* ================= DATA ================= */
export async function getStaticProps({ params }) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const post =
      posts.find((p) => p.slug === params.slug) || null;

    if (!post) {
      return {
        notFound: true,
      };
    }

    /* ترتيب المقالات المرتبطة بالذكاء */
    const relatedPosts = posts
      .filter((p) => p.slug !== post.slug)
      .map((p) => ({
        ...p,
        relevance:
          (Number(p.views) || 0) * 0.2 +
          (Number(p.clicks) || 0) * 0.5 +
          (Number(p.orders) || 0) * 2 +
          (p.viralBoost ? 20 : 0),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 6);

    return {
      props: {
        post,
        relatedPosts,
      },
      revalidate: 3600,
    };
  } catch (e) {
    console.error("BLOG STATIC PROPS:", e);

    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const paths = snap.docs
      .map((doc) => {
        const data = doc.data() || {};

        return {
          params: {
            slug: data.slug || doc.id,
          },
        };
      })
      .filter((p) => p.params.slug);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (e) {
    console.error("BLOG STATIC PATHS:", e);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
      }
            

