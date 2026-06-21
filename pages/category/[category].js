import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

import { normalizeProduct, safeText, safeImage, safeNumber } from "../../lib/normalizeProduct";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("trend");

  /* ================= SAFE CATEGORY ================= */
  const safeCategory = useMemo(() => {
    return safeText(category).toLowerCase().trim();
  }, [category]);

  useEffect(() => {
    if (!safeCategory) return;
    fetchProducts();
  }, [safeCategory, sort]);

  async function fetchProducts() {
    try {
      setLoading(true);

      const snap = await getDocs(collection(db, "products"));

      // 🔥 GLOBAL SAFE PIPELINE
      const all = snap.docs.map((d) =>
        normalizeProduct({
          id: d.id,
          ...d.data(),
        })
      );

      setAllProducts(all);

      let filtered = all
        .filter((p) => safeText(p.category).toLowerCase().trim() === safeCategory)
        .map((p) => {
          const trendScore =
            safeNumber(p.score) * 3 +
            safeNumber(p.clicks) * 2 +
            safeNumber(p.views) +
            safeNumber(p.orders) * 5 +
            safeNumber(p.rating) * 20 +
            (p.viralBoost ? 80 : 0);

          return { ...p, trendScore };
        })
        .sort((a, b) => {
          if (sort === "price_low") return safeNumber(a.price) - safeNumber(b.price);
          if (sort === "price_high") return safeNumber(b.price) - safeNumber(a.price);
          if (sort === "rating") return safeNumber(b.rating) - safeNumber(a.rating);

          return (b.trendScore || 0) - (a.trendScore || 0);
        });

      setProducts(filtered);
    } catch (err) {
      console.error("Category error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /* ================= RELATED CATEGORIES ================= */
  const relatedCategories = useMemo(() => {
    return [
      ...new Set(allProducts.map((p) => safeText(p.category)).filter(Boolean)),
    ].slice(0, 8);
  }, [allProducts]);

  /* ================= SEO ================= */
  const title = `${safeCategory || "Category"} Products | Koloonline`;

  const description =
    `Discover trending ${safeCategory} products, viral Amazon deals, and smart shopping offers.`;

  const url = `https://koloonline.online/category/${safeCategory}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
  };

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", padding: 20 }}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      <h1 style={{ fontSize: 36, textTransform: "capitalize" }}>
        📦 {safeCategory || "Category"}
      </h1>

      <p style={{ color: "#666" }}>Trending products & AI-ranked deals</p>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{ padding: 10, marginTop: 10 }}
      >
        <option value="trend">Trending</option>
        <option value="rating">Top Rated</option>
        <option value="price_low">Lowest Price</option>
        <option value="price_high">Highest Price</option>
      </select>

      {/* ================= CATEGORIES ================= */}
      <div style={{ marginTop: 20 }}>
        <h3>🔥 Categories</h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {relatedCategories.map((c) => (
            <Link key={c} href={`/category/${c}`}>
              <span
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 20,
                  background: "white",
                  display: "inline-block",
                }}
              >
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
                <Image
                  src={safeImage(p.image)}
                  width={300}
                  height={300}
                  alt={safeText(p.title)}
                />

                <h3 style={{ fontSize: 16 }}>{safeText(p.title)}</h3>

                <p style={{ color: "#B12704", fontWeight: "bold" }}>
                  ${safeNumber(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
            }
