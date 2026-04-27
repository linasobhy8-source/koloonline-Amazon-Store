import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      const data = snap.docs.map(doc => doc.data());
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const getCountry = () => {
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
    <div style={{ fontFamily: "Arial" }}>

      {/* HEADER */}
      <header style={{ background: "#131921", color: "white", padding: 15 }}>
        <img
          src="https://i.postimg.cc/9fVfC1Y4/1000276862.png"
          style={{ height: 50 }}
        />
      </header>

      {/* NAV */}
      <nav style={{ background: "#232f3e", padding: 10 }}>
        <Link href="/" style={{ color: "white", marginRight: 10 }}>
          Home
        </Link>
        <Link href="/products" style={{ color: "white" }}>
          Products
        </Link>
      </nav>

      {/* PRODUCTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
          padding: 20
        }}
      >
        {products.map((p) => (
          <div
            key={p.asin}
            style={{
              background: "white",
              padding: 10,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <img src={p.image} style={{ width: "100%" }} />

            <h3>{p.title}</h3>

            <p>${p.price}</p>

            {/* 🔥 صح: تروح لصفحة Next.js بدل Amazon مباشرة */}
            <Link href={`/product/${p.asin}`}>
              <button
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#ff9900",
                  border: "none",
                  marginTop: 10,
                  cursor: "pointer"
                }}
                onClick={() =>
                  trackEvent("product_click", { asin: p.asin })
                }
              >
                View Product
              </button>
            </Link>

            {/* أو لو عايز Amazon مباشرة */}
            <button
              onClick={() => {
                trackEvent("affiliate_click", { asin: p.asin });
                window.open(getLink(p.asin), "_blank");
              }}
              style={{
                width: "100%",
                padding: 10,
                background: "#25D366",
                border: "none",
                marginTop: 10,
                cursor: "pointer",
                color: "white"
              }}
            >
              🛒 Buy on Amazon
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
