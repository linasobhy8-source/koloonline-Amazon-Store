import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Head from "next/head";

export default function Product() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !asin) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllProducts(data);

        const found = data.find((p) => {
          if (!p?.asin) return false;

          return (
            String(p.asin).toLowerCase().trim() ===
            String(asin).toLowerCase().trim()
          );
        });

        setProduct(found || null);
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, asin]);

  const getLink = (asin) =>
    `https://www.amazon.com/dp/${asin}?tag=koloonlinesto-20`;

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading...</h2>;
  }

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Product Not Found ❌</h2>
        <p>Check Firestore ASIN or URL</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>

      <Head>
        <title>{product.title}</title>
      </Head>

      {/* PRODUCT */}
      <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
        <img src={product.image} width="300" />

        <h1>{product.title}</h1>
        <p>${product.price}</p>

        <button
          onClick={() => window.open(getLink(product.asin), "_blank")}
          style={{
            padding: 12,
            background: "#ff9900",
            border: "none",
            width: "100%",
          }}
        >
          🔥 Buy Now
        </button>
      </div>

      {/* RELATED */}
      <div style={{ padding: 20 }}>
        <h2>Related Products</h2>

        {allProducts
          .filter((p) => p.asin !== product.asin)
          .slice(0, 6)
          .map((p) => (
            <div key={p.asin} style={{ margin: 10 }}>
              <img src={p.image} width="100" />
              <p>{p.title}</p>

              <button onClick={() => router.push(`/product/${p.asin}`)}>
                View
              </button>
            </div>
          ))}
      </div>
    </div>
  );
        }
