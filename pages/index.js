import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/300x300?text=Koloonline";

/* ================= SAFE TEXT ================= */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (typeof v === "object") return v.title || v.name || v.text || "";
  return "";
};

/* ================= SAFE IMAGE ================= */
const safeImage = (v) => {
  if (!v) return fallbackImage;

  if (typeof v === "string") return v.startsWith("http") ? v : fallbackImage;

  if (typeof v === "object") {
    const img = v.url || v.image || v.src;
    if (typeof img === "string") return img;
  }

  return fallbackImage;
};

/* ================= VIRAL SCORE ================= */
const viralScore = (p = {}) => {
  let score = 0;

  score += Number(p.views || 0) * 0.5;
  score += Number(p.clicks || 0) * 2;
  score += Number(p.addToCart || 0) * 5;
  score += Number(p.orders || 0) * 10;
  score += Number(p.rating || 0) * 20;

  if (p.trending) score += 50;
  if (p.viralBoost) score += 40;

  return Math.max(0, Math.min(100, score));
};

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Koloonline - Trending Products</title>
      </Head>

      <h1>🔥 Trending Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {Array.isArray(products) &&
          products.map((p) => {
            const id = String(p?.id || "");
            const title = safeText(p?.title);
            const image = safeImage(p?.image);

            if (!id) return null;

            return (
              <Link
                key={id}
                href={`/product/${encodeURIComponent(id)}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: 12,
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <Image
                    src={image}
                    width={300}
                    height={300}
                    alt={title}
                    unoptimized
                  />

                  <h3>{title}</h3>

                  <p style={{ fontSize: 12, color: "#666" }}>
                    Score: {Math.round(viralScore(p))}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
      },
      revalidate: 1800,
    };
  } catch (e) {
    console.error(e);

    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
                      }
