import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage = "https://via.placeholder.com/500";

/* ================= WHATSAPP TRACK ================= */
function sendWhatsApp(product) {
  const message = `🔥 Product Interest:
${product.title}
Price: $${product.price}
Link: ${product.link}`;

  const whatsappURL = `https://wa.me/201234567890?text=${encodeURIComponent(message)}`;

  // tracking click (لو عندك analytics API)
  fetch("/api/track", {
    method: "POST",
    body: JSON.stringify({
      type: "whatsapp_click",
      asin: product.asin,
    }),
  }).catch(() => {});

  window.open(whatsappURL, "_blank");
}

/* ================= STAR UI ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {"⭐".repeat(full)}
      <span style={{ marginLeft: 6 }}>{rating}/5</span>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProductPage() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !asin) return;

    const load = async () => {
      const snap = await getDoc(doc(db, "products", asin));

      if (snap.exists()) {
        setProduct({ asin, ...snap.data() });
      }

      setLoading(false);
    };

    load();
  }, [router.isReady, asin]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product Not Found</p>;

  const url = `https://koloonline.online/product/${product.asin}`;
  const rating = product.rating || 4.3;

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.title,
    sku: product.asin,

    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: 120
    }
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{product.title} | Koloonline Deal</title>
        <meta name="description" content={product.title} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={product.title} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="product" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      {/* ================= PRODUCT ================= */}
      <div style={container}>

        <img src={product.image || fallbackImage} style={image} />

        <div style={{ flex: 1 }}>

          <h1>{product.title}</h1>

          <Stars rating={rating} />

          <h2 style={{ color: "#B12704" }}>
            ${product.price}
          </h2>

          {/* ================= AFFILIATE CLICK ================= */}
          <button
            style={buyBtn}
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
          >
            🛒 Buy on Amazon
          </button>

          {/* ================= WHATSAPP CONVERSION ================= */}
          <button
            style={waBtn}
            onClick={() => sendWhatsApp(product)}
          >
            💬 Order via WhatsApp
          </button>

        </div>
      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  gap: 20,
  padding: 20,
  background: "white",
};

const image = {
  width: 320,
  height: 320,
  objectFit: "contain",
};

const buyBtn = {
  width: "100%",
  padding: 15,
  background: "#ff9900",
  border: "none",
  marginTop: 10,
  cursor: "pointer",
};

const waBtn = {
  width: "100%",
  padding: 15,
  background: "#25D366",
  color: "white",
  border: "none",
  marginTop: 10,
  cursor: "pointer",
};
