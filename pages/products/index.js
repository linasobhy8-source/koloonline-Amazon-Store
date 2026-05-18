import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { calculateTrendScore } from "../../lib/trendScore";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("trending");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const fallbackImage = "https://via.placeholder.com/300";

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((d) => {
          const item = d.data();

          return {
            id: d.id,
            ...item,
            trendScore: calculateTrendScore(item || {}),
          };
        });

        setProducts(data);
      } catch (e) {
        console.log("Error loading products:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        (p.title || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sort === "price_low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price_high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      result.sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0));
    }

    return result;
  }, [products, search, sort]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Koloonline Products",
    description: "Browse trending Amazon products and smart shopping deals.",
    url: "https://koloonline.online/products",
  };

  const ogImage = "https://koloonline.online/og-products.jpg";

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>All Products | Koloonline</title>

        <meta
          name="description"
          content="Browse trending Amazon products, smart deals, and best offers on Koloonline."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://koloonline.online/products" />

        {/* OG */}
        <meta property="og:title" content="All Products | Koloonline" />
        <meta property="og:description" content="Trending Amazon deals & smart shopping." />
        <meta property="og:url" content="https://koloonline.online/products" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      <h1>📦 All Products</h1>

      {/* ================= SEARCH + SORT ================= */}
      <div
        style={{
          display: "flex",
          gap: 10,
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: 10, flex: 1, minWidth: 200 }}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: 10 }}
        >
          <option value="trending">Trending</option>
          <option value="price_low">Price Low → High</option>
          <option value="price_high">Price High → Low</option>
        </select>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <p>Loading products...</p>
      ) : filtered.length === 0 ? (
        <p>No products found</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 15,
            }}
          >
            {paginated.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div
                  style={{
                    background: "white",
                    padding: 10,
                    borderRadius: 10,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <img
                    src={p.image || fallbackImage}
                    alt={p.title || "product"}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />

                  <h4 style={{ marginTop: 10 }}>
                    {p.title || "Untitled"}
                  </h4>

                  <p style={{ color: "red", fontWeight: "bold" }}>
                    ${p.price || 0}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <button
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
            >
              Prev
            </button>

            <span>
              Page {safePage} / {totalPages}
            </span>

            <button
              disabled={safePage === totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
            }
