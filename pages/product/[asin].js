import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../config/firebase";

/* ================= AI SEO GRAPH ================= */
import { buildSeoGraph } from "@/lib/seo/aiSeoGraph";

/* ================= DYNAMIC SEO COMPONENT ================= */
const InternalLinks = dynamic(
  () => import("@/components/seo/InternalLinks"),
  {
    ssr: false,
    loading: () => <p>Loading recommendations...</p>,
  }
);

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
      }}
    >
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
        /* ================= CURRENT PRODUCT ================= */
        const snap = await getDoc(
          doc(db, "products", String(asin))
        );

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
        const productsSnap = await getDocs(
          collection(db, "products")
        );

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
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "Arial",
        }}
      >
        Loading Product...
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!product) {
    return (
      <>
        <Head>
          <title>Product Not Found | Koloonline</title>
          <meta name="robots" content="noindex" />
        </Head>

        <div style={{ padding: 40 }}>
          Product Not Found
        </div>
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
    graph.find((p) => p.asin === product.asin)
      ?.internalLinks || [];

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >

      {/* ================= SEO ================= */}
      <Head>
        <title>{title} | Best Amazon Deal 2026</title>

        <meta
          name="description"
          content={description}
        />

        <meta
          name="keywords"
          content={`${title}, Amazon Deals, ${category}, Best Amazon Products`}
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <link rel="canonical" href={url} />

        {/* ================= OPEN GRAPH ================= */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={description}
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />

        {/* ================= TWITTER ================= */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={title}
        />

        <meta
          name="twitter:description"
          content={description}
        />

        <meta
          name="twitter:image"
          content={imageUrl}
        />

        {/* ================= SCHEMA ================= */}
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

              brand: {
                "@type": "Brand",
                name: "Amazon",
              },

              category,

              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price,

                availability:
                  "https://schema.org/InStock",

                itemCondition:
                  "https://schema.org/NewCondition",

                url,
              },

              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: rating,
                reviewCount: Number(
                  product.reviewCount || 120
                ),
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
          borderRadius: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >

        {/* ================= OPTIMIZED IMAGE ================= */}
        <div
          style={{
            flex: 1,
            minWidth: 300,
            textAlign: "center",
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={500}
            priority={true}
            quality={85}
            sizes="(max-width:768px) 100vw, 500px"
            style={{
              width: "100%",
              maxWidth: 420,
              height: "auto",
              objectFit: "contain",
              borderRadius: 12,
            }}
          />
        </div>

        {/* ================= INFO ================= */}
        <div
          style={{
            flex: 1,
            minWidth: 300,
          }}
        >
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.4,
            }}
          >
            {title}
          </h1>

          <Stars rating={rating} />

          <h2
            style={{
              color: "#B12704",
              fontSize: 34,
              marginTop: 20,
            }}
          >
            ${price}
          </h2>

          {/* ================= VIRAL BADGE ================= */}
          {product.viralBoost && (
            <span
              style={{
                background:
                  "linear-gradient(45deg,#ff0000,#ff6600)",
                color: "white",
                padding: "8px 16px",
                borderRadius: 30,
                fontWeight: "bold",
                fontSize: 13,
                display: "inline-block",
                marginTop: 15,
              }}
            >
              🔥 VIRAL TRENDING NOW
            </span>
          )}

          {/* ================= DESCRIPTION ================= */}
          <p
            style={{
              marginTop: 25,
              lineHeight: 1.9,
              color: "#444",
              fontSize: 16,
            }}
          >
            {description}
          </p>

          {/* ================= BUY BUTTON ================= */}
          <button
            style={{
              width: "100%",
              padding: 16,
              background: "#ff9900",
              border: "none",
              color: "white",
              fontWeight: "bold",
              marginTop: 25,
              cursor: "pointer",
              borderRadius: 10,
              fontSize: 17,
            }}
            onClick={() => {
              fetch("/api/track-event", {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  type: "affiliate_click",
                  asin: product.asin,
                }),
              }).catch(() => {});

              window.open(product.link, "_blank");
            }}
          >
            🛒 Buy on Amazon
          </button>

          {/* ================= WHATSAPP ================= */}
          <button
            style={{
              width: "100%",
              padding: 16,
              background: "#25D366",
              color: "white",
              border: "none",
              marginTop: 12,
              cursor: "pointer",
              borderRadius: 10,
              fontSize: 17,
              fontWeight: "bold",
            }}
            onClick={() => sendWhatsApp(product)}
          >
            💬 Order via WhatsApp
          </button>

          {/* ================= CATEGORY ================= */}
          <div style={{ marginTop: 20 }}>
            <Link href={`/category/${category}`}>
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: 20,
                  background: "#f0f0f0",
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🔗 Explore more in {category}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= AI SEO INTERNAL LINKS ================= */}
      <div
        style={{
          maxWidth: 1200,
          margin: "30px auto",
          padding: 20,
        }}
      >
        <InternalLinks
          items={relatedProducts}
          title="Customers Also Viewed"
        />
      </div>

    </div>
  );
}
