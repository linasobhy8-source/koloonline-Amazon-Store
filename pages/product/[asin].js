import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { calculateTrendScore } from "../../lib/trendScore";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= UI STATES ================= */
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("trending"); // trending | price_low | price_high
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          trendScore: calculateTrendScore(d.data()),
        }));

        setProducts(data);
      } catch (e) {
        console.log("Products load error:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ================= FILTER + SEARCH ================= */
  const filtered = useMemo(() => {
    return products
      .filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === "price_low") return (a.price || 0) - (b.price || 0);
        if (sort === "price_high") return (b.price || 0) - (a.price || 0);
        return (b.trendScore || 0) - (a.trendScore || 0);
      });
  }, [products, search, sort]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Koloonline Products",
    description: "Browse trending Amazon products",
    url: "https://koloonline.online/products",
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>All Products | Koloonline</title>
        <meta
          name="description"
          content="Browse all trending Amazon products with smart filtering and deals"
        />
        <link rel="canonical" href="https://koloonline.online/products" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      <h1>📦 All Products</h1>

      {/* ================= SEARCH + SORT ================= */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: 10, flex: 1 }}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: 10 }}
        >
          <option value="trending">Trending</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
        </select>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
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
                  }}
                >
                  <img
                    src={p.image || "/placeholder.png"}
                    style={{ width: "100%" }}
                  />
                  <h4>{p.title}</h4>
                  <p style={{ color: "red" }}>${p.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
          }
