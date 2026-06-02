import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= PAGE ================= */
export default function SearchPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [suggestions, setSuggestions] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((doc) => {
          const d = doc.data();

          const aiScore =
            (d.views || 0) * 1 +
            (d.clicks || 0) * 3 +
            (d.orders || 0) * 8 +
            (d.viralBoost ? 40 : 0);

          return {
            id: doc.id,
            ...d,
            aiScore,
          };
        });

        setProducts(data);
      } catch (err) {
        console.error("Products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= BLOG POSTS ================= */
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://linasobhy.blogspot.com/feeds/posts/default?alt=rss"
        );

        const data = await res.json();

        if (data?.items) {
          setBlogPosts(data.items.slice(0, 4));
        }
      } catch (e) {
        console.error("Blog error:", e);
      }
    };

    fetchBlogPosts();
  }, []);

  /* ================= SUGGESTIONS ================= */
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const results = products
      .filter((p) =>
        (p.title || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 6);

    setSuggestions(results);
  }, [search, products]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const title = (p.title || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();

        const searchMatch = title.includes(search.toLowerCase());

        const categoryMatch =
          category === "all"
            ? true
            : cat === category.toLowerCase();

        return searchMatch && categoryMatch;
      })
      .sort((a, b) => b.aiScore - a.aiScore);
  }, [products, search, category]);

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
  }, [products]);

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>Search Products | Koloonline</title>
        <meta name="description" content="AI product search engine" />
        <meta name="robots" content="index,follow" />
      </Head>

      {/* ================= SEARCH INPUT ================= */}
      <div style={{ padding: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              background: "white",
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
      {loading ? (
        <p style={{ padding: 20 }}>Loading...</p>
      ) : (
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
                  cursor: "pointer",
                }}
              >
                <Image
                  src={p.image || fallbackImage}
                  width={300}
                  height={300}
                  alt={p.title || "product"}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />

                <h3>{p.title}</h3>

                <p style={{ color: "#B12704" }}>
                  ${p.price || 0}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
