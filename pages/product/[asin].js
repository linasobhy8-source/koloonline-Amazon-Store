import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Breadcrumb from "../../components/Breadcrumb";

/* ================= FALLBACK ================= */
const fallbackImage = "https://via.placeholder.com/500";

/* ================= STAR UI ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {"⭐".repeat(full)}
      {half && "✨"}
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

  const rating = product.rating || 4.3;
  const reviews = product.reviews || [
    { name: "Ahmed", text: "Amazing product! Fast delivery.", stars: 5 },
    { name: "Sara", text: "Good value for money.", stars: 4 },
    { name: "John", text: "Very useful and high quality.", stars: 5 },
  ];

  const isAvailable = true;

  /* ================= PRODUCT SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.title,
    sku: product.asin,

    brand: {
      "@type": "Brand",
      name: "Amazon"
    },

    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price || "0",
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://koloonline.online/product/${product.asin}`
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviews.length
    }
  };

  /* ================= BREADCRUMB SCHEMA ================= */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://koloonline.online"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category || "Category",
        item: `https://koloonline.online/category/${product.category}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `https://koloonline.online/product/${product.asin}`
      }
    ]
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{product.title} | Amazon Deal</title>
        <meta name="description" content={product.title} />
        <link rel="canonical" href={`https://koloonline.online/product/${product.asin}`} />

        {/* Open Graph */}
        <meta property="og:title" content={product.title} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* PRODUCT SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* BREADCRUMB SCHEMA (🔥 SEO قوي جدًا) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      {/* ================= BREADCRUMB UI ================= */}
      <Breadcrumb
        items={[
          { name: "Home", link: "/" },
          { name: product.category || "Category", link: `/category/${product.category}` },
          { name: product.title, link: "#" }
        ]}
      />

      {/* ================= PRODUCT HERO ================= */}
      <div style={container}>

        <img
          src={product.image || fallbackImage}
          style={image}
        />

        <div style={{ flex: 1 }}>

          <h1>{product.title}</h1>

          <Stars rating={rating} />

          <h2 style={{ color: "#B12704" }}>
            ${product.price}
          </h2>

          <p style={{ color: isAvailable ? "green" : "red" }}>
            {isAvailable ? "In Stock" : "Out of Stock"}
          </p>

          <button
            style={buyBtn}
            onClick={() => window.open(product.link, "_blank")}
          >
            🛒 Buy on Amazon
          </button>

        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div style={section}>
        <h2>Customer Reviews</h2>

        {reviews.map((r, i) => (
          <div key={i} style={reviewCard}>
            <strong>{r.name}</strong>
            <div>{"⭐".repeat(r.stars)}</div>
            <p>{r.text}</p>
          </div>
        ))}
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
  width: 300,
  height: 300,
  objectFit: "contain",
};

const buyBtn = {
  padding: 15,
  background: "#ff9900",
  border: "none",
  fontWeight: "bold",
  width: "100%",
  marginTop: 10,
  cursor: "pointer",
};

const section = {
  padding: 20,
  marginTop: 20,
  background: "white",
};

const reviewCard = {
  padding: 10,
  borderBottom: "1px solid #ddd",
};
