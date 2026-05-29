import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/600x600?text=Koloonline";

/* ================= ADS ENGINE ================= */
function getAdsSlots(type = "product") {
  return {
    product: ["under_title", "under_price", "mid_content"],
  }[type] || [];
}

function isAdsReady(product) {
  return !!(product?.title && product?.image && product?.price);
}

/* ================= ADS BOX ================= */
function AdBox() {
  if (typeof window !== "undefined") {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }

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
      <span style={{ color: "#FFA41C" }}>{"★".repeat(full)}</span>
      <span style={{ fontSize: 14, color: "#666" }}>{rating}/5</span>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProductPage({ product }) {
  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Product Not Found</h2>
        <Link href="/">Home</Link>
      </div>
    );
  }

  const adsSlots = getAdsSlots("product");
  const showAds = isAdsReady(product);

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
            />
          </div>

          {/* INFO */}
          <div style={{ flex: 1 }}>
            {/* TITLE */}
            <h1 style={{ fontSize: 32 }}>{title}</h1>

            {showAds && adsSlots.includes("under_title") && <AdBox />}

            <Stars rating={rating} />

            {/* PRICE */}
            <h2 style={{ color: "#B12704", fontSize: 36 }}>
              ${price}
            </h2>

            {showAds && adsSlots.includes("under_price") && <AdBox />}

            <p style={{ marginTop: 15 }}>{product.description}</p>

            {/* BUY */}
            <button
              onClick={() => window.open(product.link, "_blank")}
              style={{
                width: "100%",
                padding: 16,
                background: "#ff9900",
                color: "white",
                border: "none",
                marginTop: 20,
                fontSize: 18,
              }}
            >
              🛒 Buy Now
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
          <Link href="/blog/best-smart-watches">Best Smart Watches</Link>
          <br />
          <Link href="/blog/viral-products-amazon">Viral Products</Link>
        </div>
      </div>
    </div>
  );
}

/* ================= STATIC ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "products"));

  const paths = snap.docs.map((d) => ({
    params: { asin: d.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const snap = await getDocs(collection(db, "products"));

  const productDoc = snap.docs.find((d) => d.id === params.asin);

  if (!productDoc) {
    return { props: { product: null }, revalidate: 60 };
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
