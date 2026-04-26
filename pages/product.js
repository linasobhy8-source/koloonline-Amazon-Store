import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import Head from "next/head";

export default function Product() {
  const router = useRouter();
  const { asin } = router.query;

  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= TRACKING ================= */
  const trackEvent = (name, data = {}) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, data);
    }
  };

  /* ================= COUNTRY ================= */
  const getCountry = () => {
    if (typeof navigator === "undefined") return "US";

    const lang = navigator.language || "en-US";
    if (lang.includes("ar")) return "EG";
    if (lang.includes("en-CA")) return "CA";
    if (lang.includes("pl")) return "PL";
    return "US";
  };

  /* ================= AFFILIATE LINK ================= */
  const getLink = (asin) => {
    const country = getCountry();

    let tag = "koloonlinesto-20";
    if (country === "EG") tag = "onlinesh03f31-21";
    if (country === "US") tag = "onlinesho0429-20";
    if (country === "CA") tag = "linasobhy20d8-20";
    if (country === "PL") tag = "koloonline-21";

    return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!asin) return;

    const fetchProducts = async () => {
      setLoading(true);

      const snap = await getDocs(collection(db, "products"));
      const data = snap.docs.map(doc => doc.data());

      setProducts(data);

      const found = data.find(
        p => String(p.asin) === String(asin)
      );

      setCurrentProduct(found || null);
      setLoading(false);
    };

    fetchProducts();
  }, [asin]);

  /* ================= LOADING ================= */
  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading product...</h2>;
  }

  /* ================= NOT FOUND ================= */
  if (!currentProduct) {
    return <h2 style={{ padding: 20 }}>Product not found ❌</h2>;
  }

  return (
    <div style={{ fontFamily: "Arial" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{currentProduct.title}</title>
        <meta name="description" content={currentProduct.title} />

        {/* Open Graph */}
        <meta property="og:title" content={currentProduct.title} />
        <meta property="og:image" content={currentProduct.image} />
        <meta property="og:type" content="product" />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: currentProduct.title,
              image: currentProduct.image,
              offers: {
                "@type": "Offer",
                price: currentProduct.price,
                priceCurrency: "USD",
                availability: "https://schema.org/InStock"
              }
            })
          }}
        />
      </Head>

      {/* ================= UI ================= */}
      <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
        <img
          src={currentProduct.image}
          style={{ width: "100%", maxWidth: 400 }}
        />

        <h1>{currentProduct.title}</h1>

        <p style={{ color: "#b12704", fontSize: 22 }}>
          ${currentProduct.price}
        </p>

        <button
          onClick={() => {
            trackEvent("affiliate_click", {
              asin: currentProduct.asin
            });

            window.open(
              getLink(currentProduct.asin),
              "_blank"
            );
          }}
          style={{
            width: "100%",
            padding: 12,
            background: "#ff9900",
            border: "none",
            cursor: "pointer",
            borderRadius: 6
          }}
        >
          🔥 Buy Now
        </button>
      </div>

      {/* ================= RELATED ================= */}
      <div style={{ padding: 20 }}>
        <h2>🔥 Related Products</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15
          }}
        >
          {products
            .filter(p => p.asin !== currentProduct.asin)
            .map(p => (
              <div
                key={p.asin}
                style={{
                  background: "#fff",
                  padding: 10,
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}
              >
                <img src={p.image} style={{ width: "100%" }} />
                <h4>{p.title}</h4>

                <button
                  onClick={() =>
                    router.push(`/product?asin=${p.asin}`)
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 5,
                    cursor: "pointer"
                  }}
                >
                  View
                </button>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
      }
