import Head from "next/head";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SAFE CLEANERS ================= */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (typeof v === "object") return v.title || v.name || v.text || "";
  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/300x300?text=Koloonline";

  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object" && v !== null) {
    const img = v.url || v.image || v.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return fallback;
};

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Koloonline</title>
        <meta name="description" content="Trending Amazon Products" />
      </Head>

      <h1>🔥 Trending Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {Array.isArray(products) &&
          products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 10,
                  background: "#fff",
                }}
              >
                <img
                  src={safeImage(p.image)}
                  width={220}
                  height={220}
                  alt={safeText(p.title)}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: 220,
                  }}
                />

                <h3 style={{ fontSize: 16 }}>
                  {safeText(p.title)}
                </h3>

                <p style={{ color: "#B12704", fontWeight: "bold" }}>
                  ${safeNumber(p.price)}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

/* ================= DATA FETCH ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        title: safeText(d.title),
        image: safeImage(d.image),
        price: safeNumber(d.price),
      };
    });

    return {
      props: {
        products,
      },
      revalidate: 300,
    };
  } catch (e) {
    console.error("Firebase error:", e);

    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
                }
