import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../config/firebase";

const fallbackImage =
  "https://via.placeholder.com/600x600?text=Koloonline";

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
      <div style={{ color: "#FFA41C", fontSize: 18 }}>
        {"★".repeat(full)}
      </div>

      <span
        style={{
          fontSize: 14,
          color: "#555",
        }}
      >
        {rating}/5 Rating
      </span>
    </div>
  );
}

/* ================= DISCOUNT ================= */
function calculateDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return null;

  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}

/* ================= WHATSAPP ================= */
function sendWhatsApp(product) {
  const message = `🔥 Product Interest:

${product.title}

💰 Price: $${product.price}

🔗 ${product.link}`;

  const whatsappURL =
    `https://wa.me/201234567890?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
}

/* ================= PAGE ================= */
export default function ProductPage() {
  const router = useRouter();

  const { asin } = router.query;

  const [product, setProduct] = useState(null);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!router.isReady || !asin) return;

    const loadData = async () => {
      try {
        /* PRODUCT */
        const snap = await getDoc(
          doc(db, "products", String(asin))
        );

        if (snap.exists()) {
          setProduct({
            asin,
            ...snap.data(),
          });
        }

        /* ALL PRODUCTS */
        const allSnap = await getDocs(
          collection(db, "products")
        );

        setProducts(
          allSnap.docs.map((d) => ({
            asin: d.id,
            ...d.data(),
          }))
        );

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [router.isReady, asin]);

  /* ================= RELATED ================= */
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((p) => p.asin !== product.asin)
      .sort(
        (a, b) =>
          (b.views || 0) +
          (b.clicks || 0) * 2 -
          ((a.views || 0) +
            (a.clicks || 0) * 2)
      )
      .slice(0, 8);

  }, [products, product]);

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
      <div
        style={{
          padding: 40,
          textAlign: "center",
        }}
      >
        Product Not Found
      </div>
    );
  }

  /* ================= SAFE VALUES ================= */
  const title =
    product.title || "Amazon Product";

  const description =
    product.description ||
    `${title} best Amazon deal`;

  const image =
    product.image || fallbackImage;

  const price =
    Number(product.price || 0);

  const oldPrice =
    Number(product.oldPrice || 0);

  const rating =
    Number(product.rating || 4.4);

  const discount =
    calculateDiscount(price, oldPrice);

  const url =
    `https://koloonline.online/product/${product.asin}`;

  /* ================= SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: title,

    image: [image],

    description,

    sku: product.asin,

    brand: {
      "@type": "Brand",
      name: "Amazon",
    },

    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      price,
      availability:
        "https://schema.org/InStock",
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount:
        Number(product.reviewCount || 120),
    },
  };

  return (
    <div
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >

      {/* ================= SEO ================= */}
      <Head>
        <title>
          {title} | Best Amazon Deal
        </title>

        <meta
          name="description"
          content={description}
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <link
          rel="canonical"
          href={url}
        />

        {/* OG */}
        <meta
          property="og:title"
          content={title}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:image"
          content={image}
        />

        <meta
          property="og:type"
          content="product"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      {/* ================= CONTAINER ================= */}
      <div
        style={{
          maxWidth: 1300,
          margin: "auto",
          padding: 20,
        }}
      >

        {/* ================= MAIN CARD ================= */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 25,
            display: "flex",
            flexWrap: "wrap",
            gap: 30,
            boxShadow:
              "0 10px 35px rgba(0,0,0,0.08)",
          }}
        >

          {/* ================= IMAGE ================= */}
          <div
            style={{
              flex: 1,
              minWidth: 320,
              textAlign: "center",
            }}
          >

            <div
              style={{
                background: "#fafafa",
                borderRadius: 20,
                padding: 20,
              }}
            >
              <Image
                src={image}
                alt={title}
                width={500}
                height={500}
                priority
                style={{
                  width: "100%",
                  maxWidth: 450,
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

          </div>

          {/* ================= INFO ================= */}
          <div
            style={{
              flex: 1,
              minWidth: 320,
            }}
          >

            {/* CATEGORY */}
            <div
              style={{
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  background: "#eef3ff",
                  color: "#2563eb",
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                {product.category || "Trending"}
              </span>
            </div>

            {/* TITLE */}
            <h1
              style={{
                fontSize: 34,
                lineHeight: 1.4,
                marginBottom: 10,
              }}
            >
              {title}
            </h1>

            {/* RATING */}
            <Stars rating={rating} />

            {/* PRICE */}
            <div
              style={{
                marginTop: 25,
              }}
            >

              {oldPrice > price && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      textDecoration:
                        "line-through",
                      color: "#777",
                      fontSize: 20,
                    }}
                  >
                    ${oldPrice}
                  </span>

                  <span
                    style={{
                      background: "#dc2626",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    SAVE {discount}%
                  </span>
                </div>
              )}

              <h2
                style={{
                  color: "#B12704",
                  fontSize: 42,
                  marginTop: 8,
                }}
              >
                ${price}
              </h2>
            </div>

            {/* DESCRIPTION */}
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

            {/* FEATURES */}
            <div
              style={{
                marginTop: 25,
                display: "grid",
                gap: 10,
              }}
            >
              <div>✅ High Quality Product</div>
              <div>🚚 Fast Shipping</div>
              <div>💰 Best Amazon Deal</div>
              <div>🔥 Trending Product</div>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                marginTop: 30,
                display: "grid",
                gap: 12,
              }}
            >

              {/* AMAZON */}
              <button
                onClick={() => {
                  fetch("/api/track-event", {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      type:
                        "affiliate_click",
                      asin:
                        product.asin,
                    }),
                  }).catch(() => {});

                  window.open(
                    product.link,
                    "_blank"
                  );
                }}
                style={{
                  width: "100%",
                  padding: 18,
                  background:
                    "linear-gradient(45deg,#ff9900,#ffb84d)",
                  border: "none",
                  borderRadius: 14,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 18,
                  cursor: "pointer",
                  boxShadow:
                    "0 8px 20px rgba(255,153,0,0.3)",
                }}
              >
                🛒 Buy Now on Amazon
              </button>

              {/* WHATSAPP */}
              <button
                onClick={() =>
                  sendWhatsApp(product)
                }
                style={{
                  width: "100%",
                  padding: 18,
                  background:
                    "linear-gradient(45deg,#25D366,#34e27a)",
                  border: "none",
                  borderRadius: 14,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                💬 Order via WhatsApp
              </button>

            </div>

          </div>
        </div>

        {/* ================= RELATED ================= */}
        <div
          style={{
            marginTop: 40,
          }}
        >

          <h2
            style={{
              marginBottom: 20,
              fontSize: 28,
            }}
          >
            🔥 Related Products
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
            }}
          >

            {relatedProducts.map((p) => (
              <Link
                key={p.asin}
                href={`/product/${p.asin}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >

                <div
                  style={{
                    background: "white",
                    borderRadius: 18,
                    padding: 15,
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,0.06)",
                    transition: "0.3s",
                    height: "100%",
                  }}
                >

                  <Image
                    src={
                      p.image ||
                      fallbackImage
                    }
                    alt={p.title}
                    width={250}
                    height={250}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "contain",
                    }}
                  />

                  <h3
                    style={{
                      marginTop: 15,
                      fontSize: 15,
                      lineHeight: 1.6,
                    }}
                  >
                    {p.title}
                  </h3>

                  <div
                    style={{
                      marginTop: 10,
                      color: "#B12704",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    ${p.price || 0}
                  </div>

                </div>

              </Link>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
            }
