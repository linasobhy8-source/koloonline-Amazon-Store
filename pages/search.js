import Head from "next/head";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE TEXT (IMPORTANT FIX) ================= */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    return v?.title || v?.name || v?.text || "";
  }

  return "";
};

/* ================= SAFE NUMBER ================= */
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= PAGE ================= */
export default function SearchPage({ products = [] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);

  const timeoutRef = useRef(null);

  /* ================= DEBOUNCE ================= */
  const handleSearch = (value) => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setSearch(value || "");
    }, 200);
  };

  /* ================= NORMALIZE PRODUCTS (ANTI-CRASH) ================= */
  const normalizedProducts = useMemo(() => {
    return (products || [])
      .filter((p) => p && typeof p === "object")
      .map((p) => ({
        id: String(p?.id || ""),
        title: safeText(p?.title),
        category: safeText(p?.category),
        image:
          typeof p?.image === "string"
            ? p.image
            : fallbackImage,
        price: safeNumber(p?.price),
        views: safeNumber(p?.views),
        clicks: safeNumber(p?.clicks),
        orders: safeNumber(p?.orders),
        viralBoost: Boolean(p?.viralBoost),
      }));
  }, [products]);

  /* ================= AI SCORE ================= */
  const enrichedProducts = useMemo(() => {
    return normalizedProducts.map((d) => ({
      ...d,
      aiScore:
        d.views * 1 +
        d.clicks * 3 +
        d.orders * 8 +
        (d.viralBoost ? 40 : 0),
    }));
  }, [normalizedProducts]);

  /* ================= SUGGESTIONS ================= */
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const lower = search.toLowerCase();

    const results = enrichedProducts
      .filter((p) =>
        (p.title || "").toLowerCase().includes(lower)
      )
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5);

    setSuggestions(results);
  }, [search, enrichedProducts]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const lower = search.toLowerCase();

    return enrichedProducts
      .filter((p) => {
        const title = (p.title || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();

        const matchSearch = title.includes(lower);
        const matchCategory =
          category === "all" ||
          cat === category.toLowerCase();

        return matchSearch && matchCategory;
      })
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 60);
  }, [enrichedProducts, search, category]);

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      {/* ================= SEO ================= */}
      <Head>
        <title>Search Products | Koloonline</title>
        <meta name="description" content="AI product search engine" />
        <meta name="robots" content="index,follow" />
      </Head>

      {/* ================= INPUT ================= */}
      <div style={{ padding: 20 }}>
        <input
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          style={{
            padding: 12,
            width: "100%",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />

        {/* ================= SUGGESTIONS ================= */}
        {suggestions.length > 0 && (
          <div
            style={{
              background: "#fff",
              marginTop: 5,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {suggestions.map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/product/${s.id}`)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {safeText(s.title)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          padding: 20,
        }}
      >
        {filtered.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div
              style={{
                background: "white",
                padding: 15,
                borderRadius: 12,
              }}
            >
              <Image
                src={p.image || fallbackImage}
                width={300}
                height={300}
                alt={safeText(p.title)}
                style={{ width: "100%", height: "auto" }}
              />

              <h3>{safeText(p.title)}</h3>

              <p style={{ color: "#B12704" }}>
                ${safeNumber(p.price)}
              </p>
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
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data?.title || "",
        image: data?.image || "",
        price: data?.price || 0,
        category: data?.category || "",
        views: data?.views || 0,
        clicks: data?.clicks || 0,
        orders: data?.orders || 0,
        viralBoost: data?.viralBoost || false,
      };
    });

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (error) {
    console.error("SearchPage error:", error);

    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
}
