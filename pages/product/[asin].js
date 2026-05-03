import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../config/firebase";
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
    if (!router.isReady || !asin) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        /* ================= GET PRODUCT (FAST) ================= */
        const prodRef = doc(db, "products", asin);
        const prodSnap = await getDoc(prodRef);

        if (!prodSnap.exists()) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const prod = { id: asin, ...prodSnap.data(), asin };
        setProduct(prod);

        /* ================= TRACK VIEW ================= */
        trackEvent("product_view", prod);

        fetch("/api/track-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "view",
            asin,
          }),
        });

        /* ================= RELATIONS ================= */
        const relRef = doc(db, "product_relations", asin);
        const relSnap = await getDoc(relRef);

        if (relSnap.exists()) {
          const rel = relSnap.data();
          setAlsoViewed(rel.alsoViewed || []);
          setBoughtTogether(rel.boughtTogether || []);
        }

        /* ================= ALL PRODUCTS (FOR RECOMMENDATIONS) ================= */
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((d) => ({
          id: d.id,
          asin: d.id,
          ...d.data(),
        }));

        setAllProducts(data);
      } catch (err) {
        console.error("Product Page Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, asin]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product Not Found</p>;

  const buyLink = product.link || getAffiliateLink(product.asin);

  /* ================= FILTER ================= */
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
        <title>{product.title} | Koloonline</title>
        <meta name="description" content={product.title} />
      </Head>

      {/* ================= PRODUCT ================= */}
      <div style={layout}>

        <img
          src={product.image || "/placeholder.png"}
          style={image}
        />

        <div>
          <h1>{product.title}</h1>
          <h2 style={{ color: "#B12704" }}>${product.price}</h2>

          <button
            onClick={() => {
              trackEvent("amazon_click", product);

              fetch("/api/track-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "order",
                  asin: product.asin,
                }),
              });

              window.open(buyLink, "_blank");
            }}
            style={buyBtn}
          >
            🛒 Buy Now
          </button>
        </div>
      </div>

      {/* ================= ALSO VIEWED ================= */}
      <Section title="👀 Customers Also Viewed" data={recommendedProducts} router={router} />

      {/* ================= BOUGHT TOGETHER ================= */}
      <Section title="🧺 Frequently Bought Together" data={boughtTogetherProducts} router={router} />

    </div>
  );
}

/* ================= REUSABLE SECTION ================= */
function Section({ title, data, router }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>{title}</h2>

      <div style={grid}>
        {data.map((p) => (
          <div key={p.id} style={card}>

            <img src={p.image} style={img} />

            <p style={{ fontSize: 12 }}>{p.title}</p>

            <button
              onClick={() => router.push(`/product/${p.asin}`)}
              style={smallBtn}
            >
              View
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  padding: 30,
  maxWidth: 1200,
  margin: "auto",
};

const image = {
  width: "100%",
  borderRadius: 10,
};

const buyBtn = {
  width: "100%",
  padding: 15,
  background: "#ffd814",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 10,
};

const card = {
  padding: 10,
  background: "#f7f7f7",
  borderRadius: 10,
};

const img = {
  width: "100%",
  height: 120,
  objectFit: "cover",
};

const smallBtn = {
  width: "100%",
  padding: 8,
  marginTop: 5,
};
