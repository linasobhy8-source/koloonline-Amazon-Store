import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/600x600?text=Koloonline";

/* ================= ADS ENGINE ================= */
const ADS_SLOTS = {
  product: ["under_title", "under_price", "mid_content"],
};

function getAdsSlots(type = "product") {
  return ADS_SLOTS[type] || [];
}

/* ================= ADS BOX (OPTIMIZED) ================= */
function AdBox() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        textAlign: "center",
        margin: "12px 0",
        minHeight: "90px",
      }}
      data-ad-client="ca-pub-1294940976431468"
      data-ad-slot="auto"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(Number(rating || 0));

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ color: "#FFA41C" }}>
        {"★".repeat(full)}
      </span>
      <span style={{ fontSize: 14, color: "#666" }}>
        {rating}/5
      </span>
    </div>
  );
}

/* ================= WHATSAPP TRACK ================= */
function sendWhatsApp(product) {
  fetch("/api/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "whatsapp_click",
      asin: product.id,
    }),
  }).catch(() => {});

  const message = `🔥 Product Interest

${product.title}

Price: $${product.price}

${product.link}`;

  window.open(
    `https://wa.me/201234567890?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

/* ================= PAGE ================= */
export default function ProductPage({ product }) {
  const adsSlots = useMemo(() => getAdsSlots("product"), []);
  const showAds = !!product?.title && !!product?.price;

  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Product Not Found</h2>
        <Link href="/">Home</Link>
      </div>
    );
  }

  const title = product.title;
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 4.5);
  const image = product.image || fallbackImage;

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <div style={{ fontFamily: "Arial", background: "#f4f6f9" }}>
      <Head>
        <title>{title} | Koloonline</title>

        <meta name="description" content={product.description || title} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="product" />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link rel="canonical" href={url} />

        {/* SEO JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: title,
              image,
              description: product.description || title,
              sku: product.id,
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price,
                availability: "https://schema.org/InStock",
                url,
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: rating,
                reviewCount: 1,
              },
            }),
          }}
        />
      </Head>

      <div
        style={{
          maxWidth: 1200,
          margin: "auto",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 25,
            borderRadius: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 30,
            minHeight: 500,
          }}
        >
          {/* IMAGE */}
          <div style={{ flex: 1 }}>
            <Image
              src={image}
              width={500}
              height={500}
              alt={title}
              priority
              quality={75}
              sizes="(max-width:768px) 100vw, 500px"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* INFO */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 32 }}>{title}</h1>

            {showAds && adsSlots.includes("under_title") && (
              <AdBox />
            )}

            <Stars rating={rating} />

            <h2 style={{ color: "#B12704", fontSize: 36 }}>
              ${price}
            </h2>

            {showAds && adsSlots.includes("under_price") && (
              <AdBox />
            )}

            <p style={{ marginTop: 15 }}>
              {product.description}
            </p>

            {/* BUY */}
            <button
              onClick={() => {
                fetch("/api/track-event", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    type: "affiliate_click",
                    asin: product.id,
                  }),
                }).catch(() => {});

                window.open(product.link, "_blank", "noopener,noreferrer");
              }}
              style={{
                width: "100%",
                padding: 16,
                background: "#ff9900",
                color: "#fff",
                border: "none",
                marginTop: 20,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              🛒 Buy Now
            </button>

            {/* WHATSAPP */}
            <button
              onClick={() => sendWhatsApp(product)}
              style={{
                width: "100%",
                padding: 16,
                background: "#25D366",
                color: "#fff",
                border: "none",
                marginTop: 10,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              💬 Order via WhatsApp
            </button>
          </div>
        </div>

        {/* MID ADS */}
        {showAds && adsSlots.includes("mid_content") && (
          <div style={{ marginTop: 30 }}>
            <AdBox />
          </div>
        )}

        {/* LINKS */}
        <div style={{ marginTop: 40 }}>
          <h2>🔥 Related Guides</h2>

          <Link href="/blog/best-smart-watches">
            Best Smart Watches
          </Link>

          <br />

          <Link href="/blog/viral-products-amazon">
            Viral Products
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================= STATIC OPTIMIZED ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "products"));

  return {
    paths: snap.docs.slice(0, 300).map((d) => ({
      params: { asin: d.id },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const snap = await getDocs(collection(db, "products"));

  const productDoc = snap.docs.find(
    (d) => d.id === params.asin
  );

  if (!productDoc) {
    return {
      props: { product: null },
      revalidate: 60,
    };
  }

  return {
    props: {
      product: {
        id: productDoc.id,
        ...productDoc.data(),
      },
    },
    revalidate: 3600,
  };
    }
