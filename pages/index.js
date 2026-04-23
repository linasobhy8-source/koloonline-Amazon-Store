import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
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
        <a href="/" style={{ color: "white", marginRight: 10 }}>Home</a>
        <a href="/products" style={{ color: "white" }}>Products</a>
      </nav>

      {/* PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 15,
        padding: 20
      }}>

        {products.map(p => (
          <div key={p.asin} style={{
            background: "white",
            padding: 10,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>

            <img src={p.image} style={{ width: "100%" }} />

            <h3>{p.title}</h3>

            <button
              onClick={() => {
                trackEvent("affiliate_click", { asin: p.asin });
                window.open(getLink(p.asin), "_blank");
              }}
              style={{
                width: "100%",
                padding: 10,
                background: "#ff9900",
                border: "none",
                marginTop: 10,
                cursor: "pointer"
              }}
            >
              🛒 Buy Now
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}
