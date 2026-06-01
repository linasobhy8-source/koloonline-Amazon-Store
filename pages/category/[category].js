import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= CATEGORY PAGE ================= */

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("trend");

  useEffect(() => {
    if (!category) return;
    fetchProducts();
  }, [category, sort]);

  async function fetchProducts() {
    try {
      setLoading(true);

      const snap = await getDocs(collection(db, "products"));

      const all = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setAllProducts(all);

      const normalized = String(category).toLowerCase();

      let filtered = all
        .filter((p) =>
          (p.category || "").toLowerCase().includes(normalized)
        )
        .map((p) => {
          const trendScore =
            (p.score || 0) * 3 +
            (p.clicks || 0) * 2 +
            (p.views || 0) +
            (p.orders || 0) * 5 +
            (p.rating || 0) * 20 +
            (p.viralBoost ? 80 : 0);

          return { ...p, trendScore };
        })
        .sort((a, b) => {
          if (sort === "price_low") return (a.price || 0) - (b.price || 0);
          if (sort === "price_high") return (b.price || 0) - (a.price || 0);
          if (sort === "rating") return (b.rating || 0) - (a.rating || 0);

          return (b.trendScore || 0) - (a.trendScore || 0);
        });

      setProducts(filtered);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const relatedCategories = useMemo(() => {
    return [...new Set(allProducts.map((p) => p.category).filter(Boolean))].slice(0, 8);
  }, [allProducts]);

  const title = `${category || "Category"} Products | Koloonline`;
  const description = `Discover trending ${category || ""} products and Amazon deals.`;
  const url = `https://koloonline.online/category/${category}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
  };

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", padding: 20 }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      {/* ================= HEADER ================= */}
      <h1 style={{ fontSize: 36 }}>
        📦 {category}
      </h1>

      {/* ================= SORT ================= */}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="trend">Trending</option>
        <option value="rating">Top Rated</option>
        <option value="price_low">Lowest Price</option>
        <option value="price_high">Highest Price</option>
      </select>

      {/* ================= RELATED CATEGORIES ================= */}
      <div style={{ marginTop: 20 }}>
        <h3>🔥 Categories</h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {relatedCategories.map((c) => (
            <Link key={c} href={`/category/${c}`}>
              <span style={{ padding: 8, border: "1px solid #ddd", borderRadius: 20 }}>
                {c}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 20 }}>
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>

              <div style={{ background: "#fff", padding: 10, borderRadius: 12 }}>
                <Image
                  src={p.image || "https://via.placeholder.com/400"}
                  width={300}
                  height={300}
                  alt={p.title}
                />

                <h3>{p.title}</h3>

                <p style={{ color: "#B12704" }}>${p.price}</p>
              </div>

            </Link>
          ))}
        </div>
      )}
    </div>
  );
             }
