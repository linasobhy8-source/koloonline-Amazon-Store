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
export default function Home({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Koloonline Products</title>
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
          products.map((p, i) => {
            const id = typeof p?.id === "string" ? p.id : String(p?.id || "");
            const title = safeText(p?.title);
            const image = safeImage(p?.image);
            const price = safeNumber(p?.price);

            return (
              <Link key={id || i} href={`/product/${id}`}>
                <div>
                  <Image
                    src={image}
                    width={300}
                    height={300}
                    alt={title || "Product"}
                    unoptimized
                  />

                  <h3>{title}</h3>

                  <p>${price}</p>
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

    const products = snap.docs.map((doc) => {
      const d = doc.data() || {};

      return {
        id: String(doc.id || ""),
        title: safeText(d.title),
        image: safeImage(d.image),
        price: safeNumber(d.price),
      };
    });

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (e) {
    console.error("HOME ERROR:", e);

    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
                         }
