import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import Head from "next/head";

/* ================= TRACKING ================= */
async function trackEvent(type, product) {
  try {
    await addDoc(collection(db, "events"), {
      type,
      asin: product?.asin,
      title: product?.title,
      price: product?.price,
      url: window.location.href,
      country: navigator.language || "unknown",
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);
  }
}

/* ================= COUNTRY ================= */
const getCountry = () => {
  if (typeof window === "undefined") return "US";
  const lang = navigator.language || "en-US";

  if (lang.includes("ar")) return "EG";
  if (lang.includes("pl")) return "PL";
  if (lang.includes("en-CA")) return "CA";
  return "US";
};

/* ================= AFFILIATE ================= */
const getAffiliateLink = (asin) => {
  const country = getCountry();

  let tag = "koloonlinesto-20";
  if (country === "EG") tag = "onlinesh03f31-21";
  if (country === "US") tag = "onlinesho0429-20";
  if (country === "CA") tag = "linasobhy20d8-20";
  if (country === "PL") tag = "koloonline-21";

  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
};

export default function Product() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!router.isReady || !asin) return;

    const fetchData = async () => {
      const snap = await getDocs(collection(db, "products"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        asin: doc.id,
        ...doc.data(),
      }));

      setAllProducts(data);

      const found = data.find(
        (p) => p.asin?.toLowerCase() === asin.toLowerCase()
      );

      setProduct(found || null);

      if (found) trackEvent("product_view", found);

      setLoading(false);
    };

    fetchData();
  }, [router.isReady, asin]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Not Found</p>;

  const buyLink = product.link || getAffiliateLink(product.asin);

  return (
    <div style={{ fontFamily: "Arial", background: "#fff" }}>

      {/* ================= SEO + RICH SNIPPET ================= */}
      <Head>
        <title>{product.title} | Best Deal</title>
        <meta name="description" content={product.title} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.title,
            image: product.image,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
            },
          })}
        </script>
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

        <img
          src={product.image}
          style={{ width: "100%", borderRadius: 12 }}
        />

        <div>

          <h1>{product.title}</h1>

          <p style={{ color: "#ffa41c" }}>★★★★☆ (Best Seller)</p>

          <h2 style={{ color: "#111" }}>${product.price}</h2>

          <p style={{ color: "green" }}>✔ In Stock - Fast Delivery</p>

          {/* ================= BUY BUTTON ================= */}
          <button
            onClick={() => {
              trackEvent("amazon_click", product);
              window.open(buyLink, "_blank");
            }}
            style={{
              width: "100%",
              padding: 15,
              background: "#ffd814",
              border: "1px solid #fcd200",
              fontWeight: "bold",
              borderRadius: 8,
              marginTop: 15,
              cursor: "pointer",
            }}
          >
            🛒 Buy on Amazon Now
          </button>

          {/* WHATSAPP */}
          <button
            onClick={() => {
              trackEvent("whatsapp_click", product);
              window.open(
                `https://wa.me/?text=Check this product: ${product.title}`,
                "_blank"
              );
            }}
            style={{
              width: "100%",
              padding: 15,
              background: "#25D366",
              color: "white",
              border: "none",
              marginTop: 10,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            💬 Ask on WhatsApp
          </button>

          <p style={{ color: "red", marginTop: 10 }}>
            🔥 Limited Offer – price may change anytime
          </p>

        </div>
      </div>

      {/* ================= RELATED ================= */}
      <div style={{ padding: 30, background: "#f5f5f5" }}>
        <h2>🔥 Related Products</h2>

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
                borderRadius: 10
              }}>

                <img
                  src={p.image}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />

                <p>{p.title}</p>

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

      {/* ================= STICKY BUY BAR ================= */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#131921",
        padding: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}>
        <span>{product.title}</span>

        <button
          onClick={() => {
            trackEvent("amazon_click", product);
            window.open(buyLink, "_blank");
          }}
          style={{
            background: "#ff9900",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Buy Now
        </button>
      </div>

    </div>
  );
                                            }
