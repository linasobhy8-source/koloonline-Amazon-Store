import Head from "next/head";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function AmazonHaul() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const blogPosts = [
    { title: "10 Best Smart Watches on Amazon in 2026", link: "/blog/best-smart-watches" },
    { title: "Best Wireless Headphones in 2026", link: "/blog/best-headphones-2026" },
    { title: "Top Power Banks for Travel & Gaming", link: "/blog/best-power-banks-2026" },
    { title: "Best Amazon Finds Under $25", link: "/blog/amazon-finds-under-25" },
    { title: "Trending TikTok Amazon Gadgets", link: "/blog/tiktok-amazon-gadgets" },
    { title: "Best Gaming Accessories on Amazon", link: "/blog/best-gaming-accessories" },
    { title: "Top Smart Home Devices in 2026", link: "/blog/smart-home-devices-2026" },
    { title: "Best Budget Tech Products This Year", link: "/blog/budget-tech-products" },
    { title: "Best Viral Products on Amazon Right Now", link: "/blog/viral-products-amazon" },
    { title: "Best USB-C Accessories for iPhone & Android", link: "/blog/usb-c-accessories" },
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

            const baseScore = p.score * 3 + p.clicks * 2 + p.views;

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
        console.error("Firebase error:", err);
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
        <meta name="description" content="Trending Amazon Haul products and viral deals" />
        <link rel="canonical" href="https://koloonline.online/amazon-haul" />
      </Head>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.title}>🔥 Amazon Trending Haul</h1>
          <p style={styles.subtitle}>Real-time viral & trending Amazon products</p>
          <p style={styles.updated}>Updated hourly with trending Amazon deals</p>
        </section>

        <section style={styles.tagsContainer}>
          <span style={styles.tag}>🔥 Viral</span>
          <span style={styles.tag}>💸 Under $25</span>
          <span style={styles.tag}>📱 Tech</span>
          <span style={styles.tag}>🏠 Home</span>
          <span style={styles.tag}>🎮 Gaming</span>
        </section>

        <section style={styles.blogSection}>
          <h2 style={styles.blogTitle}>📝 Trending Buying Guides</h2>
          <div style={styles.blogGrid}>
            {blogPosts.map((post, i) => (
              <a key={i} href={post.link} style={styles.blogCard}>
                {post.title}
              </a>
            ))}
          </div>
        </section>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <section style={styles.grid}>
            {products.map((product) => (
              <div key={product.id} style={styles.card}>
                <img src={product.image} style={styles.image} alt={product.title} />

                <div style={styles.content}>
                  {product.viralBoost && (
                    <span style={styles.viral}>🔥 NEW VIRAL</span>
                  )}

                  <span style={styles.category}>{product.category}</span>

                  <h2 style={styles.productTitle}>{product.title}</h2>

                  <p style={styles.price}>${product.price}</p>

                  <a href={product.link} target="_blank" rel="noreferrer" style={styles.button}>
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
