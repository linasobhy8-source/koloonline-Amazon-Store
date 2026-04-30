import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import Head from "next/head";
import { trackEvent } from "../../lib/tracking";

/* ================= COUNTRY ================= */
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

  const tags = {
    EG: "onlinesh03f31-21",
    US: "onlinesho0429-20",
    CA: "linasobhy20d8-20",
    PL: "koloonline-21",
  };

  const domains = {
    EG: "amazon.com",
    US: "amazon.com",
    CA: "amazon.ca",
    PL: "amazon.pl",
  };

  const tag = tags[country] || "koloonlinesto-20";
  const domain = domains[country] || "amazon.com";

  return `https://${domain}/dp/${asin}?tag=${tag}`;
};

export default function Product() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      const snap = await getDocs(collection(db, "products"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        asin: doc.id,
        ...doc.data(),
      }));

      setAllProducts(data);

      const found = data.find((p) => p.asin === asin);
      setProduct(found || null);

      if (found) trackEvent("product_view", found);

      setLoading(false);
    };

    fetchData();
  }, [router.isReady, asin]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Not Found</p>;

  return (
    <div style={{ fontFamily: "Arial" }}>

      <Head>
        <title>{product.title}</title>
      </Head>

      {/* PRODUCT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: 30, gap: 20 }}>

        <img
          src={product.image || "/placeholder.png"}
          style={{ width: "100%", borderRadius: 10 }}
        />

        <div>
          <h1>{product.title}</h1>
          <h2>${product.price}</h2>

          <p>🔥 Limited Offer</p>

          <button
            onClick={() => {
              trackEvent("amazon_click", product);
              window.open(
                product.link || getAffiliateLink(product.asin),
                "_blank"
              );
            }}
            style={{
              width: "100%",
              padding: 15,
              background: "#ffd814",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: 6
            }}
          >
            🛒 Buy Now on Amazon
          </button>
        </div>
      </div>

      {/* RELATED */}
      <div style={{ padding: 20 }}>
        <h2>Related Products</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 10
        }}>
          {allProducts.slice(0, 6).map((p) => (
            <div key={p.id} style={{ background: "#fff", padding: 10, borderRadius: 8 }}>

              <img
                src={p.image || "/placeholder.png"}
                style={{ width: "100%" }}
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
