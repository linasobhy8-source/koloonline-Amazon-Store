import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { getProductsFast } from "../lib/firebaseQuery";
import { safeText, safeImage, safeNumber } from "../lib/safe";

const fallback = "https://via.placeholder.com/500x500?text=Koloonline";

export default function SearchPage({ products = [] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);

  const timeoutRef = useRef(null);

  const handleSearch = (value) => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setSearch(value || "");
    }, 200);
  };

  const enriched = useMemo(() => {
    return (products || []).map((p) => ({
      id: p.id,
      title: safeText(p.title),
      image: safeImage(p.image),
      price: safeNumber(p.price),
      category: safeText(p.category),
      views: safeNumber(p.views),
      clicks: safeNumber(p.clicks),
      orders: safeNumber(p.orders),
      viralBoost: Boolean(p.viralBoost),

      aiScore:
        safeNumber(p.views) +
        safeNumber(p.clicks) * 3 +
        safeNumber(p.orders) * 8 +
        (p.viralBoost ? 40 : 0),
    }));
  }, [products]);

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const lower = search.toLowerCase();

    const res = enriched
      .filter((p) => (p.title || "").toLowerCase().includes(lower))
      .slice(0, 5);

    setSuggestions(res);
  }, [search, enriched]);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();

    return enriched
      .filter((p) => {
        const title = (p.title || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();

        return (
          title.includes(lower) &&
          (category === "all" || cat === category.toLowerCase())
        );
      })
      .slice(0, 60);
  }, [enriched, search, category]);

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Search | Koloonline</title>
      </Head>

      <input
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        style={{ width: "100%", padding: 12 }}
      />

      {suggestions.map((s) => (
        <div
          key={s.id}
          onClick={() => router.push(`/product/${s.id}`)}
          style={{ padding: 10, cursor: "pointer" }}
        >
          {s.title}
        </div>
      ))}

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

export async function getStaticProps() {
  const products = await getProductsFast();

  return {
    props: { products },
    revalidate: 300,
  };
        }
