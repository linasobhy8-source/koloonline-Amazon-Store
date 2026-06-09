import Head from "next/head";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= PAGE ================= */
export default function SearchPage({ products }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);

  const timeoutRef = useRef(null);

  /* ================= DEBOUNCED SEARCH ================= */
  const handleSearch = (value) => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 200);
  };

  /* ================= AI SCORE ================= */
  const enrichedProducts = useMemo(() => {
    return products.map((d) => {
      const aiScore =
        (d.views || 0) * 1 +
        (d.clicks || 0) * 3 +
        (d.orders || 0) * 8 +
        (d.viralBoost ? 40 : 0);

      return {
        ...d,
        aiScore,
      };
    });
  }, [products]);

  /* ================= SUGGESTIONS (LIGHTWEIGHT) ================= */
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const lower = search.toLowerCase();

    const results = enrichedProducts
      .filter((p) => (p.title || "").toLowerCase().includes(lower))
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5); // 🔥 limit for performance

    setSuggestions(results);
  }, [search, enrichedProducts]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const lower = search.toLowerCase();

    return enrichedProducts
      .filter((p) => {
        const title = (p.title || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();

        return (
          title.includes(lower) &&
          (category === "all" || cat === category.toLowerCase())
        );
      })
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 60); // 🔥 limit DOM load
  }, [enrichedProducts, search, category]);

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      {/* ================= SEO ================= */}
      <Head>
        <title>Search Products | Koloonline</title>
        <meta name="description" content="AI product search engine" />
        <meta name="robots" content="index,follow" />
      </Head>

      {/* ================= SEARCH ================= */}
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
                {s.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PRODUCTS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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
                cursor: "pointer",
              }}
            >
              <Image
                src={p.image || fallbackImage}
                width={300}
                height={300}
                alt={p.title || "product"}
                style={{ width: "100%", height: "auto" }}
              />

              <h3>{p.title}</h3>

              <p style={{ color: "#B12704" }}>
                ${p.price || 0}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= ISR + FIREBASE (SERVER SIDE ONLY) ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        products,
      },

      revalidate: 300, // 🔥 5 minutes cache
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
