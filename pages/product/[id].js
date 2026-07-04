import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= SAFE HELPERS ================= */

const safeText = (v) => {
  if (v == null) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v).trim();
  }

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    return v.title || v.name || v.text || v.value || "";
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (img) =>
  typeof img === "string" && img.startsWith("http")
    ? img
    : "https://www.koloonline.online/logo.png";

/* ================= AI SCORE ENGINE ================= */

function calculateScore(product = {}) {
  return Math.round(
    safeNumber(product.score) +
      safeNumber(product.views) * 0.2 +
      safeNumber(product.clicks) * 0.6 +
      safeNumber(product.orders) * 4 +
      safeNumber(product.rating) * 15 +
      (product.viralBoost ? 70 : 0)
  );
}

/* ================= AI SEO ENGINE ================= */

function getSEOLevel(score) {
  if (score >= 320) return "elite";
  if (score >= 220) return "strong";
  if (score >= 120) return "good";
  return "weak";
}

function getRobots(score) {
  return score >= 120
    ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    : "noindex,follow";
}

/* ================= PAGE ================= */

export default function ProductPage({
  product,
  relatedProducts,
  relatedBlogs,
}) {
  if (!product) return <div>Product Not Found</div>;

  const title = safeText(product.title);
  const description = safeText(product.description);
  const image = safeImage(product.image);

  const url = `https://koloonline.online/product/${product.slug || product.id}`;

  const score = calculateScore(product);
  const seoLevel = getSEOLevel(score);
  const robotsContent = getRobots(score);

  const seoTitle =
    title.length > 60 ? `${title.slice(0, 57)}...` : title;

  const seoDescription =
    description.length > 155
      ? `${description.slice(0, 152)}...`
      : description;

  const aiBadges = [];

  if (seoLevel === "elite") aiBadges.push("🔥 Elite Product");
  if (seoLevel === "strong") aiBadges.push("⭐ Strong Performer");
  if (score > 250) aiBadges.push("🏆 High Conversion");
  if (safeNumber(product.orders) > 20) aiBadges.push("💰 Best Seller");
  if (safeNumber(product.rating) >= 4.5) aiBadges.push("✅ Top Rated");
  if (product.viralBoost) aiBadges.push("🚀 Viral Trend");

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    image: [image],
    description,
    sku: product.id,
    url,
    brand: { "@type": "Brand", name: "Koloonline" },
    offers: {
      "@type": "Offer",
      price: safeNumber(product.price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: safeNumber(product.rating) || 4.5,
      reviewCount: safeNumber(product.orders) || 1,
    },
  };

  return (
    <>
      <Head>
        <title>{seoTitle} | Koloonline</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content={robotsContent} />
        <meta name="theme-color" content="#ff9900" />
        <link rel="canonical" href={url} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />

        <meta name="twitter:card" content="summary_large_image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaProduct),
          }}
        />
      </Head>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <h1>{title}</h1>

        <Image src={image} width={1200} height={800} priority alt={title} />

        {aiBadges.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {aiBadges.map((b, i) => (
              <span
                key={i}
                style={{
                  marginRight: 8,
                  padding: "4px 10px",
                  background: "#f3f3f3",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <p style={{ marginTop: 15 }}>{description}</p>

        <p>
          <strong>Price:</strong> ${safeNumber(product.price)}
        </p>

        <p>
          <strong>AI Score:</strong> {score} ({seoLevel})
        </p>

        <div style={{ marginTop: 20 }}>
          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="nofollow sponsored noopener"
              style={{
                background: "#ff9900",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 8,
                marginRight: 10,
                fontWeight: 700,
              }}
            >
              Buy on Amazon
            </a>
          )}

          <Link href="/products">Browse Products</Link>
        </div>

        <section style={{ marginTop: 40, padding: 20, background: "#fafafa", borderRadius: 12 }}>
          <h2>AI Insight Engine</h2>
          <p>
            {seoLevel === "elite" &&
              "🔥 This product is ranked in the top AI tier due to extremely strong engagement and conversion signals."}
            {seoLevel === "strong" &&
              "⭐ Strong performing product with high user engagement and positive signals."}
            {seoLevel === "good" &&
              "👍 Stable product with moderate performance."}
            {seoLevel === "weak" &&
              "⚠️ Low engagement product — may not be highly recommended."}
          </p>
        </section>

        {relatedProducts?.length > 0 && (
          <section style={{ marginTop: 50 }}>
            <h2>Related Products</h2>
            <ul>
              {relatedProducts.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.slug || p.id}`}>
                    {safeText(p.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedBlogs?.length > 0 && (
          <section style={{ marginTop: 50 }}>
            <h2>Buying Guides</h2>
            <ul>
              {relatedBlogs.map((b) => (
                <li key={b.id}>
                  <Link href={`/blog/${b.slug}`}>
                    {safeText(b.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

/* ================= STATIC PROPS (OPTIMIZED ONLY) ================= */

export async function getStaticProps({ params }) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const product =
      products.find((p) => (p.slug || p.id) === params.id) || null;

    if (!product) return { notFound: true };

    const scoreCache = new Map();

    const getScore = (p) => {
      if (!scoreCache.has(p.id)) {
        scoreCache.set(p.id, calculateScore(p));
      }
      return scoreCache.get(p.id);
    };

    const relatedProducts = products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => getScore(b) - getScore(a))
      .slice(0, 8);

    const blogSnap = await getDocs(collection(db, "blog"));

    const relatedBlogs = blogSnap
