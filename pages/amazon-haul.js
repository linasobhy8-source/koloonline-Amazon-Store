import Head from "next/head";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function AmazonHaul() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= BLOG ARTICLES ================= */

  const blogPosts = [
    {
      title: "10 Best Smart Watches on Amazon in 2026",
      link: "/blog/best-smart-watches",
    },
    {
      title: "Best Wireless Headphones in 2026",
      link: "/blog/best-headphones-2026",
    },
    {
      title: "Top Power Banks for Travel & Gaming",
      link: "/blog/best-power-banks-2026",
    },
    {
      title: "Best Amazon Finds Under $25",
      link: "/blog/amazon-finds-under-25",
    },
    {
      title: "Trending TikTok Amazon Gadgets",
      link: "/blog/tiktok-amazon-gadgets",
    },
    {
      title: "Best Gaming Accessories on Amazon",
      link: "/blog/best-gaming-accessories",
    },
    {
      title: "Top Smart Home Devices in 2026",
      link: "/blog/smart-home-devices-2026",
    },
    {
      title: "Best Budget Tech Products This Year",
      link: "/blog/budget-tech-products",
    },
    {
      title: "Best Viral Products on Amazon Right Now",
      link: "/blog/viral-products-amazon",
    },
    {
      title: "Best USB-C Accessories for iPhone & Android",
      link: "/blog/usb-c-accessories",
    },
  ];

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        let data = snap.docs.map((doc) => {
          const d = doc.data();

          return {
            id: doc.id,
            title: d.title || "",
            image: d.image || "",
            price: d.price || 0,
            category: d.category || "General",
            link: d.link || "#",

            score: d.score || 0,
            views: d.views || 0,
            clicks: d.clicks || 0,
            updatedAt: d.updatedAt || Date.now(),

            viralBoost: d.viralBoost || false,
          };
        });

        data = data
          .map((p) => {
            const now = Date.now();
            const createdAt = p.updatedAt || now;

            const hoursOld = (now - createdAt) / (1000 * 60 * 60);

            const viralBoost =
              hoursOld <= 24 ? Math.max(0, 50 - hoursOld * 2) : 0;

            const baseScore =
              p.score * 3 + p.clicks * 2 + p.views * 1;

            return {
              ...p,
              trendScore: baseScore + viralBoost,
              viralBoost: viralBoost > 0 || p.viralBoost === true,
            };
          })
          .sort((a, b) => b.trendScore - a.trendScore)
          .slice(0, 20);

        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <>
      <Head>
        <title>Amazon Haul Deals | Viral Products</title>

        <meta
          name="description"
          content="Trending Amazon Haul products and viral deals"
        />

        <link
          rel="canonical"
          href="https://koloonline.online/amazon-haul"
        />

        {/* ================= PRODUCT SCHEMA ================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: products.map((p, index) => ({
                '@type': 'Product',
                position: index + 1,
                name: p.title,
                image: p.image,
                offers: {
                  '@type': 'Offer',
                  price: p.price,
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                },
              })),
            }),
          }}
        />
      </Head>

      <main style={styles.main}>

        {/* ================= HERO ================= */}

        <section style={styles.hero}>
          <h1 style={styles.title}>🔥 Amazon Trending Haul</h1>

          <p style={styles.subtitle}>
            Real-time viral & trending Amazon products
          </p>

          <p style={styles.updated}>
            Updated hourly with trending Amazon deals
          </p>
        </section>

        {/* ================= TAGS ================= */}

        <section style={styles.tagsContainer}>
          <span style={styles.tag}>🔥 Viral</span>
          <span style={styles.tag}>💸 Under $25</span>
          <span style={styles.tag}>📱 Tech</span>
          <span style={styles.tag}>🏠 Home</span>
          <span style={styles.tag}>🎮 Gaming</span>
        </section>

        {/* ================= BLOG ARTICLES ================= */}

        <section style={styles.blogSection}>
          <h2 style={styles.blogTitle}>📝 Trending Buying Guides</h2>

          <div style={styles.blogGrid}>
            {blogPosts.map((post, index) => (
              <a
                key={index}
                href={post.link}
                style={styles.blogCard}
              >
                {post.title}
              </a>
            ))}
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <section style={styles.grid}>
            {products.map((product) => (
              <div key={product.id} style={styles.card}>

                <img
                  src={product.image}
                  style={styles.image}
                  loading="lazy"
                  alt={product.title}
                />

                <div style={styles.content}>

                  {/* ================= VIRAL BADGE ================= */}

                  {product.viralBoost && (
                    <span style={styles.viral}>
                      🔥 NEW VIRAL
                    </span>
                  )}

                  <span style={styles.category}>
                    {product.category}
                  </span>

                  <h2 style={styles.productTitle}>
                    {product.title}
                  </h2>

                  <p style={styles.reason}>
                    Trending on TikTok & Amazon this week
                  </p>

                  <p style={styles.price}>
                    ${product.price}
                  </p>

                  {/* ================= INTERNAL LINK ================= */}

                  <a
                    href={`/category/${product.category.toLowerCase()}`}
                    style={styles.categoryLink}
                  >
                    More {product.category}
                  </a>

                  <br />
                  <br />

                  {/* ================= CTA ================= */}

                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.button}
                  >
                    🔥 View Amazon Deal
                  </a>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  main: {
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "Arial",
  },

  hero: {
    textAlign: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "42px",
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: "18px",
    color: "#555",
  },

  updated: {
    color: "#888",
    marginTop: 10,
    fontSize: 14,
  },

  tagsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },

  tag: {
    background: "#111",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "13px",
  },

  blogSection: {
    maxWidth: "1200px",
    margin: "0 auto 50px",
  },

  blogTitle: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "16px",
  },

  blogCard: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    textDecoration: "none",
    color: "#111",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  image: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
  },

  content: {
    padding: "20px",
  },

  category: {
    background: "#eee",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  productTitle: {
    fontSize: "20px",
    marginTop: "15px",
  },

  reason: {
    color: "#666",
    fontSize: "14px",
    marginTop: "10px",
  },

  price: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  viral: {
    background: "red",
    color: "white",
    padding: "4px 8px",
    fontSize: "11px",
    borderRadius: "10px",
    display: "inline-block",
    marginBottom: 8,
  },

  categoryLink: {
    color: "#0070f3",
    fontSize: "14px",
    textDecoration: "none",
  },

  button: {
    display: "inline-block",
    background: "#111",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
