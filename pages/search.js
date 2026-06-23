import Head from "next/head";
import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { getProductsFast } from "../lib/firebaseQuery";

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= HARD SAFE ================= */
const text = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";

  if (v && typeof v === "object") {
    return (
      v.title ||
      v.name ||
      v.text ||
      v.value ||
      JSON.stringify(v) || // 🔥 مهم جدًا لمنع crash
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
  return fallback;
};

/* ================= PAGE ================= */
export default function SearchPage({ products = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const timeoutRef = useRef(null);

  const safeProducts = useMemo(() => {
    return (products || [])
      .map((p) => {
        if (!p || typeof p !== "object") return null;

        const id = String(p.id || "");

        return {
          id,
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

  const handleSearch = (value) => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setSearch(String(value || ""));
    }, 200);
  };

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const lower = search.toLowerCase();

    const res = safeProducts
      .filter((p) => (p.title || "").toLowerCase().includes(lower))
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5);

    setSuggestions(res);
  }, [search, safeProducts]);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();

    return safeProducts
      .filter((p) =>
        (p.title || "").toLowerCase().includes(lower)
      )
      .slice(0, 60);
  }, [safeProducts, search]);

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Search | Koloonline</title>
      </Head>

      <input
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: "100%", padding: 12 }}
      />

      {/* suggestions */}
      {suggestions.length > 0 && (
        <div>
          {suggestions.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push(`/product/${s.id}`)}
            >
              {s.title}
            </div>
          ))}
        </div>
      )}

      {/* grid */}
      <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
        {filtered.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div>
              <Image
                src={p.image || fallback}
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

/* ================= SSR SAFE ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import("../lib/firebaseQuery");
    const products = await getProductsFast();

    return {
      props: { products: Array.isArray(products) ? products : [] },
      revalidate: 300,
    };
  } catch (e) {
    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
          }
