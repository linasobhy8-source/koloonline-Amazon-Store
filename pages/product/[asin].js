import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Head from "next/head";

export default function Product() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    if (!asin) return;

    const fetchData = async () => {
      setLoading(true);

      const snap = await getDocs(collection(db, "products"));
      const data = snap.docs.map(doc => doc.data());

      setAllProducts(data);
      setProduct(data.find(p => p.asin === asin));

      setLoading(false);
    };

    fetchData();
  }, [asin]);

  const getLink = (asin) =>
    `https://www.amazon.com/dp/${asin}?tag=koloonlinesto-20`;

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  if (!product) return <h2 style={{ padding: 20 }}>Product Not Found ❌</h2>;

  return (
    <div style={{ fontFamily: "Arial" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.title} />

        <meta property="og:title" content={product.title} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              image: product.image,
              offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "USD",
                availability: "https://schema.org/InStock"
              }
            })
          }}
        />
      </Head>

      {/* ================= PRODUCT ================= */}
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
            width: "100%"
          }}
        >
          🔥 Buy Now
        </button>
      </div>

      {/* ================= RELATED ================= */}
      <div style={{ padding: 20 }}>
        <h2>Related Products</h2>

        {allProducts
          .filter(p => p.asin !== product.asin)
          .slice(0, 6)
          .map(p => (
            <div key={p.asin} style={{ margin: 10 }}>
              <img src={p.image} width="100" />
              <p>{p.title}</p>

              <button
                onClick={() =>
                  router.push(`/product/${p.asin}`)
                }
              >
                View
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
