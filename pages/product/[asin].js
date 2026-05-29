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

/* ================= ADS ENGINE ================= */
function getAdsSlots(type = "product") {
  const map = {
    product: ["under_title", "under_price", "mid_content"],
  };

  return map[type] || [];
}

function isAdsReady(product) {
  if (!product) return false;

  // approval boost logic (signals)
  const hasTitle = !!product.title;
  const hasImage = !!product.image;
  const hasPrice = Number(product.price || 0) > 0;

  return hasTitle && hasImage && hasPrice;
}

/* ================= ADS BLOCK ================= */
function AdBox() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "10px 0" }}
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

/* ================= WHATSAPP ================= */
function sendWhatsApp(product) {
  const msg = `🔥 Deal Alert:

${product?.title}
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

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    if (!router.isReady || !asin) return;

    const load = async () => {
      try {
        const ref = doc(db, "products", String(asin));
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, asin]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!product) return <div style={{ padding: 40 }}>Product Not Found</div>;

  /* ================= ADS LOGIC ================= */
  const adsSlots = getAdsSlots("product");
  const showAds = isAdsReady(product);

  const title = product.title;
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 4.5);
  const image = product.image || fallbackImage;

  const url = `https://koloonline.online/product/${asin}`;

  return (
    <div style={{ fontFamily: "Arial", background: "#f4f6f9" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{title} | Koloonline Deal</title>
        <meta name="description" content={product.description || title} />
        <link rel="canonical" href={url} />
      </Head>

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
            <Image src={image} width={500} height={500} alt={title} />
          </div>

          {/* INFO */}
          <div style={{ flex: 1 }}>

            {/* ================= ADS UNDER TITLE ================= */}
            <h1 style={{ fontSize: 32 }}>{title}</h1>

            {showAds && adsSlots.includes("under_title") && (
              <AdBox />
            )}

            <Stars rating={rating} />

            {/* ================= PRICE ================= */}
            <h2 style={{ color: "#B12704", fontSize: 36 }}>
              ${price}
            </h2>

            {/* ================= ADS UNDER PRICE ================= */}
            {showAds && adsSlots.includes("under_price") && (
              <AdBox />
            )}

            <p style={{ marginTop: 15 }}>
              {product.description}
            </p>

            {/* BUY BUTTON */}
            <button
              onClick={() => {
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
              🛒 Buy Now
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

        {/* ================= MID ADS ================= */}
        {showAds && adsSlots.includes("mid_content") && (
          <div style={{ marginTop: 30 }}>
            <AdBox />
          </div>
        )}

        {/* LINKS */}
        <div style={{ marginTop: 40 }}>
          <h2>🔥 Related Guides</h2>
          <Link href="/blog/best-smart-watches">Best Smart Watches</Link><br />
          <Link href="/blog/viral-products-amazon">Viral Products</Link><br />
        </div>

      </div>
    </div>
  );
        }
