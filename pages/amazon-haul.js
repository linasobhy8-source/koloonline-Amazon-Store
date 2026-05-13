import Head from "next/head";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function AmazonHaul() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
              (p.score * 3) +
              (p.clicks * 2) +
              (p.views * 1);

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
      </Head>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.title}>🔥 Amazon Trending Haul</h1>
          <p style={styles.subtitle}>
            Real-time viral & trending products
          </p>
        </section>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <section style={styles.grid}>
            {products.map((product) => (
              <div key={product.id} style={styles.card}>

                <img
                  src={product.image}
                  style={styles.image}
                />

                <div style={styles.content}>

                  {/* 🔥 VIRAL BADGE */}
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

                  <p style={styles.price}>
                    ${product.price}
                  </p>

                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.button}
                  >
                    🛒 Shop Now
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
    marginBottom: "40px",
  },

  title: {
    fontSize: "42px",
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: "18px",
    color: "#555",
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
