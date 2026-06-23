import Head from "next/head";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const FALLBACK =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= ABSOLUTE SAFE ================= */
const toText = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (!v) return "";

  if (typeof v === "object") {
    try {
      return (
        v.title ||
        v.name ||
        v.text ||
        v.value ||
        JSON.stringify(v) || // 🔥 يمنع crash نهائي 100%
        ""
      );
    } catch {
      return "";
    }
  }

  return "";
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (v && typeof v === "object") {
    const img = v.url || v.image || v.src;
    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }
  }

  return FALLBACK;
};

/* ================= PAGE ================= */
export default function SearchPage({ products = [] }) {
  const [q, setQ] = useState("");

  /* 🔥 HARD SANITIZE EVERYTHING */
  const safeProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products
      .filter((p) => p && typeof p === "object")
      .map((p) => {
        const title = toText(p.title);
        const image = toImage(p.image);
        const price = toNumber(p.price);

        const views = toNumber(p.views);
        const clicks = toNumber(p.clicks);
        const orders = toNumber(p.orders);

        return {
          id: String(p.id || ""),
          title,
          image,
          price,

          score: views + clicks * 3 + orders * 8,
        };
      })
      .filter((p) => p.id);
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();

    return safeProducts
      .filter((p) => (p.title || "").toLowerCase().includes(query))
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
        onChange={(e) => setQ(e.target.value)}
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
                alt={p.title}
                unoptimized
              />

              <h3>{p.title}</h3>
              <p>${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= SAFE BUILD ================= */
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
