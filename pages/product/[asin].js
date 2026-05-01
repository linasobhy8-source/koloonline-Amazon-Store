import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
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

/* ================= AFFILIATE ================= */
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

  const [alsoViewed, setAlsoViewed] = useState([]);
  const [boughtTogether, setBoughtTogether] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      try {
        /* ================= PRODUCTS ================= */
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((d) => ({
          id: d.id,
          asin: d.id,
          ...d.data(),
        }));

        setAllProducts(data);

        const found = data.find((p) => p.asin === asin);
        setProduct(found || null);

        if (found) {
          trackEvent("product_view", found);

          /* ================= AI RECOMMENDATIONS ================= */
          const relRef = doc(db, "product_relations", asin);
          const relSnap = await getDoc(relRef);

          if (relSnap.exists()) {
            const rel = relSnap.data();

            setAlsoViewed(rel.alsoViewed || []);
            setBoughtTogether(rel.boughtTogether || []);
          }
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchData();
  }, [router.isReady, asin]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Not Found</p>;

  const buyLink = product.link || getAffiliateLink(product.asin);

  /* ================= FILTER RECOMMENDED ================= */
  const recommendedProducts = allProducts.filter((p) =>
    alsoViewed.includes(p.asin)
  );

  const boughtTogetherProducts = allProducts.filter((p) =>
    boughtTogether.includes(p.asin)
  );

  return (
    <div style={{ fontFamily: "Arial", background: "#fff" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{product.title} | Koloonline Store</title>
      </Head>

      {/* ================= PRODUCT ================= */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        padding: 30,
        gap: 20,
        maxWidth: 1200,
        margin: "auto"
      }}>

        <img src={product.image || "/placeholder.png"} style={{ width: "100%" }} />

        <div>
          <h1>{product.title}</h1>
          <h2>${product.price}</h2>

          <button
            onClick={() => {
              trackEvent("amazon_click", product);
              window.open(buyLink, "_blank");
            }}
            style={{
              width: "100%",
              padding: 15,
              background: "#ffd814",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🛒 Buy Now
          </button>
        </div>
      </div>

      {/* ================= AI: ALSO VIEWED ================= */}
      <div style={{ padding: 20 }}>
        <h2>👀 Customers Also Viewed</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 10
        }}>
          {recommendedProducts.map((p) => (
            <div key={p.id} style={{ padding: 10 }}>
              <img src={p.image} style={{ width: "100%" }} />
              <p>{p.title}</p>
              <button onClick={() => router.push(`/product/${p.asin}`)}>
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= AI: BOUGHT TOGETHER ================= */}
      <div style={{ padding: 20 }}>
        <h2>🧺 Frequently Bought Together</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 10
        }}>
          {boughtTogetherProducts.map((p) => (
            <div key={p.id} style={{ padding: 10 }}>
              <img src={p.image} style={{ width: "100%" }} />
              <p>{p.title}</p>
              <button onClick={() => router.push(`/product/${p.asin}`)}>
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FALLBACK ================= */}
      <div style={{ padding: 20 }}>
        <h2>🔥 More Products</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 10
        }}>
          {allProducts.slice(0, 6).map((p) => (
            <div key={p.id}>
              <img src={p.image} style={{ width: "100%" }} />
              <p>{p.title}</p>
              <button onClick={() => router.push(`/product/${p.asin}`)}>
                View
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
                }
