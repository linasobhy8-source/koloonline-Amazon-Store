import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS (FIREBASE) ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= AMAZON TAG BY COUNTRY ================= */
  const getCountry = () => {
    if (typeof window === "undefined") return "US";

    const lang = navigator.language || "en-US";

    if (lang.includes("ar")) return "EG";
    if (lang.includes("en-CA")) return "CA";
    if (lang.includes("pl")) return "PL";

    return "US";
  };

  const getLink = (asin) => {
    const country = getCountry();

    let tag = "koloonlinesto-20";
    if (country === "EG") tag = "onlinesh03f31-21";
    if (country === "US") tag = "onlinesho0429-20";
    if (country === "CA") tag = "linasobhy20d8-20";
    if (country === "PL") tag = "koloonline-21";

    return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
  };

  /* ================= TRACKING ================= */
  const trackEvent = (name, data = {}) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, data);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= HEADER ================= */}
      <header style={{
        background: "#131921",
        color: "white",
        padding: 15,
        display: "flex",
        alignItems: "center"
      }}>
        <img
          src="https://i.postimg.cc/9fVfC1Y4/1000276862.png"
          alt="logo"
          style={{ height: 45 }}
        />
      </header>

      {/* ================= NAV ================= */}
      <nav style={{
        background: "#232f3e",
        padding: 10,
        color: "white"
      }}>
        <Link href="/" style={{ color: "white", marginRight: 15 }}>
          Home
        </Link>
      </nav>

      {/* ================= CONTENT ================= */}
      <div style={{ padding: 20 }}>

        {/* LOADING */}
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (

          /* PRODUCTS GRID */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15
          }}>
            {products.map((p) => (
              <div
                key={p.id || p.asin}
                style={{
                  background: "white",
                  padding: 12,
                  borderRadius: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >

                {/* IMAGE */}
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.title || "product"}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    height: 180,
                    objectFit: "cover"
                  }}
                />

                {/* TITLE */}
                <h3 style={{ fontSize: 14 }}>
                  {p.title || "No title"}
                </h3>

                {/* PRICE */}
                <p style={{ fontWeight: "bold" }}>
                  ${p.price || 0}
                </p>

                {/* VIEW PRODUCT */}
                <Link href={`/product/${p.asin || ""}`}>
                  <button
                    onClick={() =>
                      trackEvent("product_click", { asin: p.asin })
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      background: "#ff9900",
                      border: "none",
                      cursor: "pointer",
                      marginTop: 8,
                      borderRadius: 5
                    }}
                  >
                    View Product
                  </button>
                </Link>

                {/* AMAZON BUY */}
                <button
                  onClick={() => {
                    if (!p.asin) return;
                    trackEvent("affiliate_click", { asin: p.asin });
                    window.open(getLink(p.asin), "_blank");
                  }}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#25D366",
                    border: "none",
                    cursor: "pointer",
                    marginTop: 8,
                    color: "white",
                    borderRadius: 5
                  }}
                >
                  🛒 Buy on Amazon
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
