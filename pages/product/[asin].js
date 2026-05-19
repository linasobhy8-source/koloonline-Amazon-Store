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

/* ================= AI SEO GRAPH ================= */
import { buildSeoGraph } from "@/lib/seo/aiSeoGraph";
import InternalLinks from "@/components/seo/InternalLinks";

import Link from "next/link";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= WHATSAPP TRACK ================= */
function sendWhatsApp(product) {
  const message = `🔥 Product Interest:
${product.title}
Price: $${product.price}
Link: ${product.link}`;

  const whatsappURL =
    `https://wa.me/201234567890?text=${encodeURIComponent(message)}`;

  fetch("/api/track-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
      <span style={{ marginLeft: 6 }}>{rating}/5</span>
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
        /* ================= CURRENT PRODUCT ================= */
        const snap = await getDoc(doc(db, "products", String(asin)));

        if (snap.exists()) {
          setProduct({
            asin,
            ...snap.data(),
          });
        } else {
          setLoading(false);
          return;
        }

        /* ================= ALL PRODUCTS ================= */
        const productsSnap = await getDocs(collection(db, "products"));

        const allProducts = productsSnap.docs.map((doc) => ({
          asin: doc.id,
          ...doc.data(),
        }));

        setProducts(allProducts);

      } catch (err) {
        console.error("PRODUCT PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, asin]);

  /* ================= LOADING ================= */
  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  /* ================= NOT FOUND ================= */
  if (!product) {
    return (
      <>
        <Head>
          <title>Product Not Found | Koloonline</title>
          <meta name="robots" content="noindex" />
        </Head>

        <p style={{ padding: 20 }}>Product Not Found</p>
      </>
    );
  }

  /* ================= SAFE VALUES ================= */
  const title = product.title || "Amazon Product";

  const description =
    product.description ||
    `${title} best Amazon deal and smart shopping recommendation.`;

  const imageUrl = product.image || fallbackImage;
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 4.4);
  const category = product.category || "general";

  const url = `https://koloonline.online/product/${product.asin}`;

  /* ================= AI SEO GRAPH ================= */
  const graph = buildSeoGraph(products, 6);

  const relatedProducts =
    graph.find((p) => p.asin === product.asin)?.internalLinks || [];

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{title} | Best Amazon Deal 2026</title>

        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: title,
              image: [imageUrl],
              description,
              sku: product.asin,
              brand: { "@type": "Brand", name: "Amazon" },
              category,
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price,
                availability: "https://schema.org/InStock",
                itemCondition: "https://schema.org/NewCondition",
                url,
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: rating,
                reviewCount: Number(product.reviewCount || 120),
              },
            }),
          }}
        />
      </Head>

      {/* ================= PRODUCT ================= */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          padding: 20,
          background: "white",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: 320,
            maxWidth: "100%",
            height: 320,
            objectFit: "contain",
            borderRadius: 10,
          }}
          loading="lazy"
        />

        <div style={{ flex: 1 }}>
          <h1>{title}</h1>

          <Stars rating={rating} />

          <h2 style={{ color: "#B12704" }}>${price}</h2>

          {/* ================= VIRAL BADGE ================= */}
          {product.viralBoost && (
            <span
              style={{
                background: "linear-gradient(45deg,#ff0000,#ff6600)",
                color: "white",
                padding: "6px 12px",
                borderRadius: 20,
                fontWeight: "bold",
                fontSize: 12,
                display: "inline-block",
                marginTop: 10,
              }}
            >
              🔥 VIRAL TRENDING NOW
            </span>
          )}

          {/* ================= DESCRIPTION ================= */}
          <p style={{ marginTop: 20, lineHeight: 1.7 }}>
            {description}
          </p>

          {/* ================= BUY BUTTON ================= */}
          <button
            style={{
              width: "100%",
              padding: 15,
              background: "#ff9900",
              border: "none",
              color: "white",
              fontWeight: "bold",
              marginTop: 20,
              cursor: "pointer",
              borderRadius: 8,
            }}
            onClick={() => {
              fetch("/api/track-event", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
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

          {/* ================= WHATSAPP ================= */}
          <button
            style={{
              width: "100%",
              padding: 15,
              background: "#25D366",
              color: "white",
              border: "none",
              marginTop: 10,
              cursor: "pointer",
              borderRadius: 8,
            }}
            onClick={() => sendWhatsApp(product)}
          >
            💬 Order via WhatsApp
          </button>

          {/* ================= CATEGORY CLUSTER LINK ================= */}
          <div style={{ marginTop: 15 }}>
            <Link href={`/category/${category}`}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: 20,
                  background: "#f0f0f0",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                🔗 Explore more in {category}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= AI SEO INTERNAL LINKS ================= */}
      <div style={{ maxWidth: 1200, margin: "30px auto", padding: 20 }}>
        <InternalLinks
          items={relatedProducts}
          title="Customers Also Viewed"
        />
      </div>

    </div>
  );
}
