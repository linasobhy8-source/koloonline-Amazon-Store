import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import Head from "next/head";

export default function Product() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= COUNTRY DETECTION ================= */
  const getCountry = () => {
    if (typeof window === "undefined") return "US";

    const lang = navigator.language || "en-US";

    if (lang.includes("ar")) return "EG";
    if (lang.includes("en-CA")) return "CA";
    if (lang.includes("pl")) return "PL";

    return "US";
  };

  /* ================= AFFILIATE LINK ================= */
  const getAffiliateLink = (asin) => {
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
    if (!router.isReady || !asin) return;

    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          asin: doc.id, // 🔥 مهم جدًا
          ...doc.data(),
        }));

        setAllProducts(data);

        const found = data.find(
          (p) => p.asin.toLowerCase() === asin.toLowerCase()
        );

        setProduct(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, asin]);

  /* ================= STATES ================= */
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!product) return <p style={{ padding: 20 }}>❌ Product Not Found</p>;

  return (
    <div style={{ fontFamily: "Arial", background: "#fff" }}>
      
      <Head>
        <title>{product.title}</title>
      </Head>

      {/* ================= MAIN ================= */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 30,
        padding: 30,
        maxWidth: 1200,
        margin: "auto"
      }}>

        {/* IMAGE */}
        <div>
          <img
            src={product.image || "/placeholder.png"}
            alt={product.title}
            style={{
              width: "100%",
              borderRadius: 10
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.png";
            }}
          />
        </div>

        {/* INFO */}
        <div>

          <h1 style={{ fontSize: 22 }}>{product.title}</h1>

          {/* ⭐ fake rating */}
          <p style={{ color: "#ffa41c", fontSize: 18 }}>
            ★★★★☆ (1,245 ratings)
          </p>

          <p style={{ fontSize: 24, fontWeight: "bold" }}>
            ${product.price}
          </p>

          <p style={{ color: "green", marginTop: 10 }}>
            In Stock
          </p>

          {/* ================= BUTTONS ================= */}
          <button
            onClick={() => {
              const link = product.link || getAffiliateLink(product.asin);
              window.open(link, "_blank");
            }}
            style={{
              width: "100%",
              padding: 12,
              background: "#ffd814",
              border: "1px solid #fcd200",
              marginTop: 15,
              cursor: "pointer",
              borderRadius: 5,
              fontWeight: "bold"
            }}
          >
            🛒 Buy on Amazon
          </button>

          <button
            style={{
              width: "100%",
              padding: 12,
              background: "#ffa41c",
              border: "none",
              marginTop: 10,
              cursor: "pointer",
              borderRadius: 5,
              fontWeight: "bold"
            }}
          >
            ⚡ Add to Cart
          </button>

        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div style={{ padding: 30, maxWidth: 1200, margin: "auto" }}>
        <h2>Product Details</h2>
        <p>
          This is a high-quality product available on Amazon. Designed for daily
          use with premium performance and durability.
        </p>
      </div>

      {/* ================= RELATED ================= */}
      <div style={{ padding: 30, background: "#f5f5f5" }}>
        <h2 style={{ marginBottom: 20 }}>Related Products</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 15
        }}>
          {allProducts
            .filter((p) => p.asin !== product.asin)
            .slice(0, 6)
            .map((p) => (
              <div key={p.id} style={{
                background: "white",
                padding: 10,
                borderRadius: 8
              }}>
                
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.title}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />

                <p style={{ fontSize: 14 }}>{p.title}</p>

                <button
                  onClick={() => router.push(`/product/${p.asin}`)}
                  style={{
                    width: "100%",
                    padding: 8,
                    background: "#131921",
                    color: "white",
                    border: "none",
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
