import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/600x600?text=Koloonline";

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);

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
  return `${product.title} is one of the trending Amazon products in 2026, optimized for performance, quality, and value. This product is currently gaining high engagement and conversion based on user behavior data on Koloonline.`;
}

/* ================= WHATSAPP ================= */
function sendWhatsApp(product) {
  const msg = `🔥 Deal Alert:

${product.title}
💰 Price: $${product.price}
🔗 ${product.link}`;

  window.open(
    `https://wa.me/201234567890?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

export default function ProductPage() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD SINGLE PRODUCT ONLY (FIX IMPORTANT) ================= */
  useEffect(() => {
    if (!router.isReady || !asin) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "products", String(asin)));

        if (snap.exists()) {
          setProduct({ asin, ...snap.data() });
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, asin]);

  /* ================= SEO ================= */
  const url = `https://koloonline.online/product/${asin}`;

  if (loading)
    return <div style={{ padding: 40 }}>Loading...</div>;

  if (!product)
    return <div style={{ padding: 40 }}>Product Not Found</div>;

  const title = product.title || "Amazon Product";
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 4.5);

  const description = generateAIDescription(product);

  return (
    <div style={{ fontFamily: "Arial", background: "#f4f6f9" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{title} | Koloonline Deal</title>

        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        {/* OG */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
      </Head>

      {/* ================= CONTAINER ================= */}
      <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>

        {/* ================= PRODUCT CARD ================= */}
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
              src={product.image || fallbackImage}
              width={500}
              height={500}
              alt={title}
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {/* INFO */}
          <div style={{ flex: 1 }}>

            <h1 style={{ fontSize: 32 }}>{title}</h1>

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

            {/* CTA */}
            <button
              onClick={() => {
                fetch("/api/track-event", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "affiliate_click",
                    asin: product.asin,
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

        {/* ================= INTERNAL SEO LINKS ================= */}
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
