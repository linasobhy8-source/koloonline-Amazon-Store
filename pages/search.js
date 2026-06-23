import Head from "next/head";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const FALLBACK =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= HARD SAFE ================= */
const text = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (!v) return "";

  if (typeof v === "object") {
    return (
      v.title ||
      v.name ||
      v.text ||
      v.value ||
      JSON.stringify(v) || // 🔥 يمنع crash نهائي
      ""
    );
  }

  return "";
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const img = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (v && typeof v === "object") {
    const x = v.url || v.image || v.src;
    if (typeof x === "string") return x;
  }

  return FALLBACK;
};

/* ================= PAGE ================= */
export default function SearchPage({ products = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  /* 🔥 SAFE NORMALIZATION */
  const safeProducts = useMemo(() => {
    return (products || [])
      .map((p) => {
        if (!p || typeof p !== "object") return null;

        return {
          id: String(p.id || ""),
          title: text(p.title),
          category: text(p.category),
          image: img(p.image),
          price: num(p.price),
          views: num(p.views),
          clicks: num(p.clicks),
          orders: num(p.orders),
          viralBoost: Boolean(p.viralBoost),

          aiScore:
            num(p.views) +
            num(p.clicks) * 3 +
            num(p.orders) * 8 +
            (p.viralBoost ? 40 : 0),
        };
      })
      .filter(Boolean);
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return safeProducts
      .filter((p) => (p.title || "").toLowerCase().includes(q))
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 50);
  }, [safeProducts, search]);

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Search | Koloonline</title>
      </Head>

      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
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

/* ================= SAFE SSR ================= */
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
