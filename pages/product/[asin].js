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

/* ================= ADS BOX ================= */
function AdBox() {
  useEffect(() => {
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

/* ================= TRACK BUY ================= */
async function handleBuy(product) {
  try {
    await fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "affiliate_click",
        asin: product.id,
        price: product.price,
      }),
    });
  } catch (_) {}

  setTimeout(() => {
    window.open(product.link, "_blank", "noopener,noreferrer");
  }, 120);
}

/* ================= WHATSAPP ================= */
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

/* ================= 🔥 NATIVE AD (HIGH CTR) ================= */
function NativeAdCard() {
  return (
    <a
      href="/products"
      style={{
        display: "block",
        padding: 15,
        margin: "15px 0",
        background: "#fff3cd",
        borderRadius: 12,
        textDecoration: "none",
        color: "#000",
        fontWeight: "bold",
      }}
    >
      🔥 Recommended Deal
      <br />
      <span style={{ fontWeight: 400 }}>
        Check today’s trending Amazon discounts
      </span>
    </a>
  );
}

/* ================= 🔥 STICKY BUY BAR ================= */
function StickyBuyBar({ product }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        padding: 12,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <span style={{ fontWeight: "bold" }}>
        ${product.price}
      </span>

      <button
        onClick={() => handleBuy(product)}
        style={{
          background: "#ff9900",
          padding: "10px 20px",
          border: 0,
          color: "#fff",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Buy Now
      </button>
    </div>
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
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
        <div
          style={{
            background: "white",
            padding: 25,
            borderRadius: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 30,
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
              style={{ width: "100%", height: "auto" }}
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
              onClick={() => handleBuy(product)}
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

            {/* 🔥 NATIVE AD (HIGH CTR) */}
            <NativeAdCard />
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

      {/* 🔥 STICKY BUY BAR */}
      <StickyBuyBar product={product} />
    </div>
  );
}

/* ================= STATIC ================= */
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
