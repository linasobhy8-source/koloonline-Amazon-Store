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

        const clean = (val) =>
          String(val || "").toLowerCase().trim();

        const found = data.find((p) => clean(p.asin) === clean(asin));

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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!product) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial" }}>
        <h2>❌ Product Not Found</h2>

        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: 10,
            padding: 10,
            background: "#232f3e",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.title} />
      </Head>

      {/* ================= PRODUCT ================= */}
      <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>

        <img
          src={product.image}
          alt={product.title}
          style={{ width: "100%", maxWidth: 300 }}
        />

        <h1>{product.title}</h1>
        <p style={{ fontSize: 18 }}>${product.price}</p>

        {/* 🔥 AMAZON BUTTON (MODIFIED) */}
        <button
          onClick={() => {
            const link =
              product.link ||
              `https://www.amazon.com/dp/${product.asin}?tag=koloonlinesto-20`;

            window.open(link, "_blank");
          }}
          style={{
            padding: 12,
            background: "#ff9900",
            border: "none",
            width: "100%",
            cursor: "pointer",
            marginTop: 10,
            fontWeight: "bold",
          }}
        >
          🔥 Buy Now on Amazon
        </button>
      </div>

      {/* ================= RELATED ================= */}
      <div style={{ padding: 20 }}>
        <h2>Related Products</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: 10,
        }}>
          {allProducts
            .filter((p) => p.asin !== product.asin)
            .slice(0, 6)
            .map((p) => (
              <div key={p.id} style={{
                border: "1px solid #eee",
                padding: 10,
                borderRadius: 8,
              }}>
                <img src={p.image} style={{ width: "100%" }} />
                <p style={{ fontSize: 12 }}>{p.title}</p>

                <button
                  onClick={() => router.push(`/product/${p.asin}`)}
                  style={{
                    width: "100%",
                    padding: 6,
                    background: "#131921",
                    color: "white",
                    border: "none",
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
