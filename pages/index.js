import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SAFE ================= */
const safeText = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    return v?.text || v?.title || v?.name || v?.value || "";
  }

  return "";
};

const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/300x300?text=Koloonline";

  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object" && v !== null) {
    const img = v?.url || v?.image || v?.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return fallback;
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= PAGE ================= */
export default function ProductsPage({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>🔥 Trending Products</title>
      </Head>

      <h1>🔥 Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {Array.isArray(products) &&
          products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <div>
                <Image
                  src={safeImage(p.image)}
                  width={300}
                  height={300}
                  alt={safeText(p.title)}
                  unoptimized
                />

                <h3>{safeText(p.title)}</h3>

                <p>${safeNumber(p.price)}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: safeText(data.title),
        image: safeImage(data.image),
        price: safeNumber(data.price),
      };
    });

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (error) {
    console.error("HOME ERROR:", error);

    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
}
