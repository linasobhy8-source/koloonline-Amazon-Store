import Head from "next/head";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const FALLBACK = "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE ================= */
const safeText = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (v && typeof v === "object") return v.title || v.name || v.text || "";
  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  if (v && typeof v === "object") {
    const img = v.url || v.image || v.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }
  return FALLBACK;
};

/* ================= PAGE ================= */
export default function SearchPage({ products = [] }) {
  const [q, setQ] = useState("");

  const safeProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products
      .filter((p) => p && typeof p === "object")
      .map((p) => ({
        id: String(p.id || ""),
        title: safeText(p.title),
        image: safeImage(p.image),
        price: safeNumber(p.price),
        score:
          safeNumber(p.views) +
          safeNumber(p.clicks) * 3 +
          safeNumber(p.orders) * 8,
      }))
      .filter((p) => p.id);
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();

    return safeProducts
      .filter((p) => p.title.toLowerCase().includes(query))
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [q, safeProducts]);

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Search | Koloonline</title>
      </Head>

      <input
        placeholder="Search products..."
        onChange={(e) => setQ(e.target.value || "")}
        style={{ width: "100%", padding: 12 }}
      />

      <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
        {filtered.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div style={{ border: "1px solid #ddd", padding: 10 }}>
              <Image
                src={p.image}
                width={300}
                height={300}
                alt={p.title || "product"}
                unoptimized
              />

              <h3>{p.title || ""}</h3>
              <p>${p.price || 0}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= ISR ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import("../lib/firebaseQuery");

    const products = await getProductsFast();

    return {
      props: {
        products: Array.isArray(products) ? products : [],
      },
      revalidate: 300,
    };
  } catch (e) {
    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
        }
