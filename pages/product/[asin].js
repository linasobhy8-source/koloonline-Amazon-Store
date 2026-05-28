import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/600x600?text=Koloonline";

/* ================= SAFE HELPERS ================= */
function safeText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(Number(rating || 0));

  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      <span style={{ color: "#FFA41C" }}>
        {"★".repeat(full)}
      </span>
      <span style={{ fontSize: 14, color: "#666" }}>
        {rating}/5
      </span>
    </div>
  );
}

/* ================= AI DESCRIPTION ================= */
function generateAIDescription(product) {
  const title = safeText(product?.title) || "Amazon Product";

  return `${title} is trending on Koloonline with high engagement and strong conversion signals.`;
}

/* ================= WHATSAPP ================= */
function sendWhatsApp(product) {
  const msg = `🔥 Deal Alert:

${safeText(product?.title)}
💰 Price: $${product?.price || 0}
🔗 ${product?.link || ""}`;

  window.open(
    `https://wa.me/201234567890?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

/* ================= PAGE ================= */
export default function ProductPage() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PRODUCT (FIXED) ================= */
  useEffect(() => {
    if (!router.isReady || !asin) return;

    const load = async () => {
      try {
        /* ✅ FIX: asin is DOCUMENT ID (NOT query) */
        const ref = doc(db, "products", String(asin));
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProduct({
            id: snap.id,
            ...snap.data(),
          });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Product Load Error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, asin]);

  /* ================= LOADING ================= */
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  /* ================= NOT FOUND ================= */
  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <h2>😢 Product Not Found</h2>
        <Link href="/">🏠 Go Home</Link>
      </div>
    );
  }

  /* ================= SAFE DATA ================= */
  const title = safeText(product.title) || "Amazon Product";
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 4.5);
  const description = generateAIDescription(product);

  const image =
    typeof product.image === "string"
      ? product.image
      : fallbackImage;

  const url = `https://koloonline.online/product/${asin}`;

  return (
    <div style={{ fontFamily: "Arial", background: "#f4f6f9" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{title} | Koloonline Deal</title>

        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image || fallbackImage} />
        <meta property="og:type" content="product" />
      </Head>

      {/* ================= CONTAINER ================= */}
      <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>

        <div style={{
          background: "white",
          padding: 25,
          borderRadius: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 30
        }}>

          {/* IMAGE */}
          <div style={{ flex: 1 }}>
            <Image
              src={image}
              width={500}
              height={500}
              alt={title}
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {/* INFO */}
          <div style={{ flex: 1 }}>

            <h1 style={{ fontSize: 32 }}>
              {title}
            </h1>

            <Stars rating={rating} />

            <h2 style={{ color: "#B12704", fontSize: 36 }}>
              ${price}
            </h2>

            <p style={{ marginTop: 15, color: "#444" }}>
              {description}
            </p>

            {/* TRUST */}
            <div style={{ marginTop: 20 }}>
              <p>✅ Fast Delivery</p>
              <p>🔥 Trending Product</p>
              <p>💰 Best Amazon Price</p>
            </div>

            {/* BUY BUTTON */}
            <button
              onClick={() => {
                fetch("/api/track-event", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "affiliate_click",
                    asin,
                  }),
                });

                window.open(product.link, "_blank");
              }}
              style={{
                width: "100%",
                padding: 16,
                background: "#ff9900",
                color: "white",
                border: "none",
                marginTop: 20,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              🛒 Buy Now on Amazon
            </button>

            {/* WHATSAPP */}
            <button
              onClick={() => sendWhatsApp(product)}
              style={{
                width: "100%",
                padding: 16,
                background: "#25D366",
                color: "white",
                border: "none",
                marginTop: 10,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              💬 WhatsApp Order
            </button>

          </div>
        </div>

        {/* LINKS */}
        <div style={{ marginTop: 40 }}>
          <h2>🔥 Related Guides</h2>

          <Link href="/blog/best-smart-watches">Best Smart Watches</Link><br />
          <Link href="/blog/viral-products-amazon">Viral Amazon Products</Link><br />
          <Link href="/blog/best-headphones-2026">Best Headphones</Link>
        </div>

      </div>
    </div>
  );
}
