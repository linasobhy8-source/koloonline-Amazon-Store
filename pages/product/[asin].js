import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import Head from "next/head";
import { trackEvent } from "../../lib/tracking";

export default function Product() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAffiliateLink = (asin) =>
    `https://www.amazon.com/dp/${asin}?tag=koloonlinesto-20`;

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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: 30 }}>

        <img src={product.image} style={{ width: "100%" }} />

        <div>
          <h1>{product.title}</h1>
          <h2>${product.price}</h2>

          <p>🔥 Limited Offer</p>

          <button
            onClick={() => {
              trackEvent("amazon_click", product);
              window.open(product.link || getAffiliateLink(product.asin), "_blank");
            }}
            style={{
              width: "100%",
              padding: 15,
              background: "#ffd814",
              border: "none",
              fontWeight: "bold"
            }}
          >
            Buy Now on Amazon
          </button>

        </div>
      </div>

      {/* RELATED */}
      <div style={{ padding: 20 }}>
        <h2>Related</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {allProducts.slice(0, 6).map((p) => (
            <div key={p.id} style={{ background: "#fff", padding: 10 }}>
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
