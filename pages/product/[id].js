import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= SAFE HELPERS ================= */

const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    return String(v).trim();
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (typeof v === "object") return v.title || v.name || v.text || v.value || "";
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

/* ================= AI CORE ENGINE ================= */

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

/* ================= REVENUE ENGINE ================= */

function getRevenueScore(product) {
  return (
    safeNumber(product.orders) * 5 +
    safeNumber(product.clicks) * 1.5 +
    safeNumber(product.rating) * 10 +
    (product.viralBoost ? 80 : 0)
  );
}

function getTrendingScore(product) {
  return (
    safeNumber(product.views) * 0.3 +
    safeNumber(product.clicks) * 0.8 +
    safeNumber(product.orders) * 5 +
    (product.viralBoost ? 100 : 0)
  );
}

function isBestSeller(product) {
  return safeNumber(product.orders) > 30 && safeNumber(product.rating) >= 4.3;
}

function getBestCTA(product) {
  const score = getRevenueScore(product);

  if (score > 400) return "🔥 Buy Now - Limited Offer";
  if (score > 250) return "⭐ Best Deal - Buy Now";
  if (score > 120) return "🛒 Check Price";
  return "View Product";
}

/* ================= SMART ENGINE ================= */

function getSmartRelated(products, currentId) {
  return products
    .filter((p) => p.id !== currentId)
    .map((p) => ({
      ...p,
      score: calculateScore(p) * 0.5 + getRevenueScore(p) * 0.5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function getTrendingProducts(products) {
  return products
    .map((p) => ({ ...p, trendingScore: getTrendingScore(p) }))
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 5);
}

function getProfitTrending(products) {
  return products
    .map((p) => ({
      ...p,
      hybridScore:
        getTrendingScore(p) * 0.6 + getRevenueScore(p) * 0.4,
    }))
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, 5);
}

/* ================= CONVERSION ENGINE ================= */

function getBestFor(product, seoLevel) {
  const list = [];
  if (safeNumber(product.price) < 50) list.push("Budget buyers");
  if (safeNumber(product.rating) >= 4.5) list.push("Quality-focused users");
  if (product.viralBoost) list.push("Trend seekers");
  if (seoLevel === "elite") list.push("Premium buyers");
  return list.length ? list : ["General users"];
}

function getWhoShouldBuy(product, seoLevel) {
  const list = [];
  if (safeNumber(product.orders) > 20)
    list.push("Users who trust social proof");
  if (seoLevel !== "weak")
    list.push("Users looking for proven products");
  return list.length ? list : ["General shoppers"];
}

function getWhyTrust(product) {
  return [
    "AI-based scoring system",
    safeNumber(product.orders) > 10
      ? "Real purchase signals detected"
      : "Limited purchase data",
    safeNumber(product.rating) >= 4
      ? "Positive reviews trend"
      : "Mixed feedback",
  ];
}

/* ================= FAQ ENGINE ================= */

function generateFAQs(product, seoLevel) {
  const title = safeText(product.title);

  return [
    {
      q: `Is ${title} worth buying?`,
      a:
        seoLevel === "elite"
          ? "Yes, top-tier AI-ranked product."
          : "Depends on your needs.",
    },
    {
      q: `Is ${title} good quality?`,
      a:
        safeNumber(product.rating) >= 4
          ? "Yes, high quality."
          : "Moderate quality.",
    },
    {
      q: `Is it suitable for beginners?`,
      a: seoLevel !== "weak" ? "Yes" : "Needs caution.",
    },
  ];
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

  const seoTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const seoDescription =
    description.length > 155
      ? description.slice(0, 152) + "..."
      : description;

  const revenueRelated = getSmartRelated(relatedProducts || [], product.id);
  const trendingProducts = getTrendingProducts(relatedProducts || []);
  const profitTrending = getProfitTrending(relatedProducts || []);
  const bestCTA = getBestCTA(product);
  const isBest = isBestSeller(product);
  const faqs = generateFAQs(product, seoLevel);

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    image: [image],
    description: seoDescription,
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
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Head>
        <title>{seoTitle} | Koloonline</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content={robotsContent} />
        <link rel="canonical" href={url} />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={image} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaProduct),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </Head>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <h1>{title}</h1>

        <Image
          src={image}
          width={1200}
          height={800}
          priority
          alt={title}
          style={{ width: "100%", height: "auto" }}
        />

        <p>{description}</p>

        <p>
          <strong>Price:</strong> ${safeNumber(product.price)}
        </p>

        <p>
          <strong>AI Score:</strong> {score} ({seoLevel})
        </p>

        {product.link && (
          <a
            href={product.link}
            target="_blank"
            rel="nofollow sponsored"
            style={{
              background: "#ff9900",
              color: "#fff",
              padding: 12,
              display: "inline-block",
              marginTop: 10,
            }}
          >
            {bestCTA}
          </a>
        )}

        {/* REVENUE */}
        <section>
          <h2>🔥 Revenue Picks</h2>
          {revenueRelated.map((p) => (
            <Link key={p.id} href={`/product/${p.slug || p.id}`}>
              <div>{safeText(p.title)}</div>
            </Link>
          ))}
        </section>

        {/* TRENDING */}
        <section>
          <h2>📈 Trending</h2>
          {trendingProducts.map((p) => (
            <Link key={p.id} href={`/product/${p.slug || p.id}`}>
              <div>{safeText(p.title)}</div>
            </Link>
          ))}
        </section>

        {/* FAQ */}
        <section>
          <h2>❓ FAQ</h2>
          {faqs.map((f, i) => (
            <div key={i}>
              <h4>{f.q}</h4>
              <p>{f.a}</p>
            </div>
          ))}
        </section>

        <section>
          <h2>🔥 Best Seller</h2>
          <p>{isBest ? "YES 🔥" : "No"}</p>
        </section>
      </main>
    </>
  );
}

/* ================= STATIC PROPS ================= */

export async function getStaticProps({ params }) {
  const snap = await getDocs(query(collection(db, "products"), limit(200)));

  const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const product =
    products.find((p) => (p.slug || p.id) === params.id) || null;

  if (!product) return { notFound: true };

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 10);

  const blogSnap = await getDocs(query(collection(db, "blog"), limit(6)));

  const relatedBlogs = blogSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    props: {
      product,
      relatedProducts,
      relatedBlogs,
    },
    revalidate: 300,
  };
}

/* ================= STATIC PATHS ================= */

export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "products"));

  return {
    paths: snap.docs.map((d) => ({
      params: { id: String(d.data().slug || d.id) },
    })),
    fallback: "blocking",
  };
    }
