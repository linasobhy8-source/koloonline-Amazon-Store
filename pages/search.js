import Head from "next/head";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { normalizeProduct } from "../lib/dataFirewall";

const FALLBACK =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE RENDER ================= */
const safe = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (typeof v === "object") {
    try {
      return v.title || v.name || v.text || JSON.stringify(v) || "";
    } catch {
      return "";
    }
  }

  return "";
};

const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  if (typeof v === "object" && v?.url) return v.url;
  if (typeof v === "object" && v?.image) return v.image;
  return FALLBACK;
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= PAGE ================= */
export default function SearchPage(props) {
  const products = Array.isArray(props?.products) ? props.products : [];

  const [q, setQ] = useState("");

  /* ================= NORMALIZE (CRASH PROTECTION LAYER) ================= */
  const safeProducts = useMemo(() => {
    return products
      .filter((p) => p && typeof p === "object")
      .map((p) => {
        const normalized = normalizeProduct
          ? normalizeProduct(p)
          : p;

        return {
          id: String(normalized.id || ""),
          title: safe(normalized.title),
          image: safeImage(normalized.image),
          price: safeNumber(normalized.price),
          score:
            safeNumber(normalized.views) +
            safeNumber(normalized.clicks) * 3 +
            safeNumber(normalized.orders) * 8,
        };
      })
      .filter((p) => p.id && p.title);
  }, [products]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const query = (q || "").toLowerCase();

    return safeProducts
      .filter((p) =>
        (p.title || "").toLowerCase().includes(query)
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [q, safeProducts]);

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Search | Koloonline</title>
      </Head>

      {/* ================= INPUT ================= */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value || "")}
        placeholder="Search products..."
        style={{
          width: "100%",
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 6,
        }}
      />

      {/* ================= GRID ================= */}
      <div
        style={{
          display: "grid",
          gap: 20,
          marginTop: 20,
        }}
      >
        {filtered.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div
              style={{
                border: "1px solid #eee",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Image
                src={p.image || FALLBACK}
                width={300}
                height={300}
                alt={safe(p.title)}
                unoptimized
              />

              <h3>{safe(p.title)}</h3>
              <p>${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= BUILD SAFE ================= */
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
  } catch (error) {
    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
           }
