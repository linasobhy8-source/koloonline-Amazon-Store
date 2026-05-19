import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const fallbackImage = "https://via.placeholder.com/500";

/* ================= STARS ================= */
function Stars({ rating = 4.3 }) {
  const full = Math.round(rating);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {"⭐".repeat(full)}
      <span style={{ marginLeft: 6 }}>{rating}/5</span>
    </div>
  );
}

/* ================= WHATSAPP ================= */
function sendWhatsApp(product) {
  const msg = `🔥 Product Interest:
${product.title}
Price: $${product.price}
Link: https://koloonline.online/product/${product.asin}`;

  window.open(
    `https://wa.me/201234567890?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

export default function ProductPage() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!router.isReady || !asin) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "products", asin));

        if (snap.exists()) {
          setProduct({ asin, ...snap.data() });
        }

        const allSnap = await getDocs(collection(db, "products"));

        setAllProducts(
          allSnap.docs.map((d) => ({
            asin: d.id,
            ...d.data(),
          }))
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, asin]);

  /* ================= RELATED PRODUCTS ================= */
  const related = useMemo(() => {
    if (!product) return [];

    return allProducts
      .filter((p) => p.asin !== product.asin)
      .sort(
        (a, b) =>
          (b.views || 0) + (b.clicks || 0) * 2 -
          ((a.views || 0) + (a.clicks || 0) * 2)
      )
      .slice(0, 6);
  }, [allProducts, product]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product Not Found</p>;

  const url = `https://koloonline.online/product/${product.asin}`;
  const rating = product.rating || 4.3;

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image || fallbackImage,
    description: `${product.title} - Best Amazon deal on Koloonline`,
    sku: product.asin,

    brand: {
      "@type": "Brand",
      name: "Amazon",
    },

    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price || 0,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url,
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: product.reviews || 120,
    },
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{product.title} | Koloonline Deal</title>

        <meta
          name="description"
          content={`${product.title} - Buy now on Koloonline with best Amazon deals and discounts`}
        />

        <meta
          name="keywords"
          content={`amazon deals, ${product.title}, koloonline, buy online`}
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />

        {/* OG */}
        <meta property="og:title" content={product.title} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="product" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      {/* ================= PRODUCT ================= */}
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: 20,
          maxWidth: 1100,
          margin: "auto",
          background: "white",
        }}
      >
        <img
          src={product.image || fallbackImage}
          loading="lazy"
          style={{
            width: 350,
            height: 350,
            objectFit: "contain",
          }}
        />

        <div style={{ flex: 1 }}>
          <h1>{product.title}</h1>

          <Stars rating={rating} />

          <h2 style={{ color: "#B12704" }}>
            ${product.price || 0}
          </h2>

          {/* 🔥 badge */}
          {product.viralBoost && (
            <span
              style={{
                background: "red",
                color: "white",
                padding: "6px 12px",
                borderRadius: 20,
                display: "inline-block",
                marginTop: 10,
              }}
            >
              🔥 Trending Now
            </span>
          )}

          {/* BUY */}
          <button
            onClick={() => {
              fetch("/api/track", {
                method: "POST",
                body: JSON.stringify({
                  type: "affiliate_click",
                  asin: product.asin,
                }),
              });

              window.open(product.link, "_blank");
            }}
            style={{
              width: "100%",
              padding: 15,
              marginTop: 15,
              background: "#ff9900",
              border: "none",
              cursor: "pointer",
            }}
          >
            🛒 Buy on Amazon
          </button>

          {/* WHATSAPP */}
          <button
            onClick={() => sendWhatsApp(product)}
            style={{
              width: "100%",
              padding: 15,
              marginTop: 10,
              background: "#25D366",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            💬 WhatsApp Order
          </button>

          <p style={{ marginTop: 10, color: "gray", fontSize: 12 }}>
            ⚡ Prices may change anytime
          </p>
        </div>
      </div>

      {/* ================= RELATED ================= */}
      <div style={{ maxWidth: 1100, margin: "auto", padding: 20 }}>
        <h2>🔥 Related Products</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 10,
          }}
        >
          {related.map((p) => (
            <a
              key={p.asin}
              href={`/product/${p.asin}`}
              style={{
                background: "white",
                padding: 10,
                textDecoration: "none",
                color: "black",
              }}
            >
              <img
                src={p.image || fallbackImage}
                loading="lazy"
                style={{ width: "100%", height: 120 }}
              />
              <p>{p.title}</p>
              <b>${p.price || 0}</b>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
    }
