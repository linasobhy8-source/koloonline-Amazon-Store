import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= FALLBACK IMAGE ================= */
const fallbackImage =
  "https://via.placeholder.com/300x300?text=Koloonline";

/* ================= IMAGE OPTIMIZER ================= */
function optimizeImage(src) {
  if (!src) return fallbackImage;

  if (src.includes("amazon")) {
    return src.replace("http://", "https://");
  }

  return src;
}

/* ================= VIRAL SCORE ================= */
function viralScore(p) {
  let score = 0;

  score += (p.views || 0) * 0.5;
  score += (p.clicks || 0) * 2;
  score += (p.addToCart || 0) * 5;
  score += (p.orders || 0) * 10;
  score += (p.rating || 0) * 20;

  if (p.trending) score += 50;
  if (p.viralBoost) score += 40;

  return Math.max(0, Math.min(100, score));
}

/* ================= PAGE ================= */
export default function ProductsPage({ products }) {
  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: 20,
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>🔥 Trending Products | Koloonline Deals</title>

        <meta
          name="description"
          content="Discover viral Amazon products, trending gadgets and AI-ranked deals updated in real time."
        />

        <meta
          name="keywords"
          content="viral products, amazon deals, trending gadgets, smart watch, electronics"
        />

        <meta name="robots" content="index,follow" />

        <link rel="canonical" href="https://koloonline.online" />

        <meta property="og:title" content="🔥 Trending Products | Koloonline" />
        <meta
          property="og:description"
          content="AI-ranked viral products and trending Amazon deals updated daily."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://koloonline.online" />
      </Head>

      {/* ================= HERO ================= */}
      <h1 style={{ fontSize: 32 }}>🔥 Viral & Trending Products</h1>

      <p style={{ color: "#666", marginBottom: 20 }}>
        AI-ranked products based on real-time engagement, clicks and sales signals.
      </p>

      {/* ================= PRODUCTS GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 25,
        }}
      >
        {products.map((p, index) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            prefetch={false}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article
              style={{
                background: "#fff",
                padding: 12,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              {/* ================= VIRAL BADGE ================= */}
              {p.viralScore > 80 && (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "red",
                    color: "#fff",
                    padding: "4px 8px",
                    fontSize: 12,
                    borderRadius: 6,
                  }}
                >
                  🔥 Viral
                </span>
              )}

              {p.trending && (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "orange",
                    color: "#fff",
                    padding: "4px 8px",
                    fontSize: 12,
                    borderRadius: 6,
                  }}
                >
                  Trending
                </span>
              )}

              {/* ================= IMAGE ================= */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 250,
                }}
              >
                <Image
                  src={optimizeImage(p.image)}
                  alt={p.title || "Product"}
                  fill
                  priority={index < 4}
                  quality={75}
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={fallbackImage}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* ================= TITLE ================= */}
              <h2 style={{ fontSize: 16, marginTop: 12, minHeight: 45 }}>
                {p.title}
              </h2>

              {/* ================= SCORE INFO (optional SEO signal) */}
              <p style={{ fontSize: 12, color: "#888" }}>
                Score: {Math.round(viralScore(p))}
              </p>

              {/* ================= PRICE ================= */}
              <p
                style={{
                  color: "#B12704",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                ${p.price || 0}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= STATIC GENERATION (ISR + VIRAL SORTING) ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 🔥 Viral sort before rendering
    const sorted = products
      .map((p) => ({
        ...p,
        viralScore:
          (p.views || 0) * 0.5 +
          (p.clicks || 0) * 2 +
          (p.addToCart || 0) * 5 +
          (p.orders || 0) * 10 +
          (p.rating || 0) * 20 +
          (p.trending ? 50 : 0) +
          (p.viralBoost ? 40 : 0),
      }))
      .sort((a, b) => b.viralScore - a.viralScore);

    return {
      props: {
        products: sorted,
      },

      // ISR refresh
      revalidate: 1800, // 30 min (faster viral updates)
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        products: [],
      },

      revalidate: 300,
    };
  }
            }
