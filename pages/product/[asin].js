import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../config/firebase";

/* ================= SEO INTERNAL LINKS ================= */
import InternalLinks from "@/components/seo/InternalLinks";
import { generateInternalLinks } from "@/lib/seo/internalLinks";

/* ================= SEO BLOCKS ================= */
import ProductSEOBlocks from "@/components/seo/ProductSEOBlocks";

/* ================= SEO SCHEMA (STEP 3) ================= */
import {
  generateProductSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemaGenerator";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/500";

/* ================= WHATSAPP TRACK ================= */
function sendWhatsApp(product) {
  const message = `🔥 Product Interest:
${product.title}
Price: $${product.price}
Link: ${product.link}`;

  const whatsappURL =
    `https://wa.me/201234567890?text=${encodeURIComponent(message)}`;

  fetch("/api/track", {
    method: "POST",
    body: JSON.stringify({
      type: "whatsapp_click",
      asin: product.asin,
    }),
  }).catch(() => {});

  window.open(whatsappURL, "_blank");
}

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {"⭐".repeat(full)}
      <span style={{ marginLeft: 6 }}>
        {rating}/5
      </span>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProductPage() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !asin) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "products", asin));

        if (snap.exists()) {
          setProduct({
            asin,
            ...snap.data(),
          });
        }

        const productsSnap = await getDocs(
          collection(db, "products")
        );

        const allProducts = productsSnap.docs.map((doc) => ({
          asin: doc.id,
          ...doc.data(),
        }));

        setProducts(allProducts);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    load();
  }, [router.isReady, asin]);

  if (loading)
    return <p style={{ padding: 20 }}>Loading...</p>;

  if (!product)
    return <p style={{ padding: 20 }}>Product Not Found</p>;

  const url =
    `https://koloonline.online/product/${product.asin}`;

  const rating =
    product.rating || 4.3;

  /* ================= RELATED PRODUCTS ================= */
  const relatedProducts =
    generateInternalLinks({
      currentItem: product,
      allItems: products,
      limit: 8,
    });

  /* ================= STEP 3 SCHEMA ENGINE ================= */
  const productSchema = generateProductSchema(product, url);
  const faqSchema = generateFAQSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema(product, url);

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      <Head>
        <title>{product.title} | Koloonline Deal</title>

        <meta
          name="description"
          content={`${product.title} - Best price, trending Amazon product. Check reviews, pros & cons and buy now at Koloonline.`}
        />

        <link rel="canonical" href={url} />

        <meta property="og:title" content={product.title} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="product" />

        {/* ================= PRODUCT SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />

        {/* ================= FAQ SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />

        {/* ================= BREADCRUMB SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      {/* ================= PRODUCT LAYOUT ================= */}

      <div style={container}>

        <img
          src={product.image || fallbackImage}
          style={image}
          alt={product.title}
        />

        <div style={{ flex: 1 }}>

          <h1>{product.title}</h1>

          <Stars rating={rating} />

          <h2 style={{ color: "#B12704" }}>
            ${product.price}
          </h2>

          {product.viralBoost && (
            <span style={viralBadge}>
              🔥 VIRAL TRENDING NOW
            </span>
          )}

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

          <button
            style={waBtn}
            onClick={() => sendWhatsApp(product)}
          >
            💬 Order via WhatsApp
          </button>

          <p style={trustLine}>
            ⚡ Limited-time Amazon deal — prices may change anytime
          </p>

        </div>
      </div>

      {/* ================= INTERNAL LINKS ================= */}

      <div style={wrapper}>
        <InternalLinks
          items={relatedProducts}
          title="Customers Also Viewed"
        />
      </div>

      {/* ================= SEO CONTENT BLOCKS ================= */}

      <div style={wrapper}>
        <ProductSEOBlocks product={product} />
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
  maxWidth: 1200,
  margin: "0 auto",
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

const viralBadge = {
  background: "linear-gradient(45deg, #ff0000, #ff6600)",
  color: "white",
  padding: "6px 12px",
  borderRadius: 20,
  fontWeight: "bold",
  fontSize: 12,
  display: "inline-block",
  marginTop: 10,
};

const trustLine = {
  marginTop: 10,
  color: "gray",
  fontSize: 12,
};

const wrapper = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 20,
};
