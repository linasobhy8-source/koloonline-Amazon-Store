import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH PRODUCTS ================= */
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
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FILTER ================= */
  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= AMAZON LINK ================= */
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
        alignItems: "center",
        gap: 15
      }}>
        
        <img
          src="https://i.postimg.cc/9fVfC1Y4/1000276862.png"
          alt="logo"
          style={{ height: 45 }}
        />

        {/* 🔍 SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 5,
            border: "none",
            outline: "none"
          }}
        />

        {/* 🔍 GOOGLE CSE */}
        <script async src="https://cse.google.com/cse.js?cx=a62092fd965664e67"></script>
        <div className="gcse-search"></div>

      </header>

      {/* ================= NAV ================= */}
      <nav style={{
        background: "#232f3e",
        padding: 10,
        color: "white"
      }}>
        <Link href="/" style={{ color: "white" }}>Home</Link>
      </nav>

      {/* ================= ADSENSE ================= */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1294940976431468"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>
          {(adsbygoogle = window.adsbygoogle || []).push({})}
        </script>
      </div>

      {/* ================= CONTENT ================= */}
      <div style={{ padding: 20 }}>

        {loading ? (
          <p>Loading products...</p>
        ) : filtered.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15
          }}>
            {filtered.map((p) => (
              <div key={p.id || p.asin} style={{
                background: "white",
                padding: 12,
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                
                <img
                  src={p.image}
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />

                <h3>{p.title}</h3>
                <p>${p.price}</p>

                <Link href={`/product/${p.asin}`}>
                  <button
                    onClick={() => trackEvent("product_click", { asin: p.asin })}
                    style={{
                      width: "100%",
                      padding: 10,
                      background: "#ff9900",
                      border: "none",
                      marginTop: 8
                    }}
                  >
                    View Product
                  </button>
                </Link>

                <button
                  onClick={() => window.open(getLink(p.asin), "_blank")}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#25D366",
                    border: "none",
                    marginTop: 8,
                    color: "white"
                  }}
                >
                  Buy on Amazon
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
          }
