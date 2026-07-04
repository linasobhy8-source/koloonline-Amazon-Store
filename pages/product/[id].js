import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FAST HELPERS ================= */

const safeText = (v) =>
  typeof v === "string" || typeof v === "number"
    ? String(v)
    : v?.title || v?.name || "";

const safeNumber = (v) => (v && !isNaN(v) ? Number(v) : 0);

const safeImage = (img) =>
  typeof img === "string" && img.startsWith("http")
    ? img
    : "https://www.koloonline.online/logo.png";

/* ================= LIGHT AI SCORE ================= */

const calcScore = (p) => {
  const v = safeNumber(p.views);
  const c = safeNumber(p.clicks);
  const o = safeNumber(p.orders);
  const r = safeNumber(p.rating);

  return v * 0.1 + c * 0.4 + o * 3 + r * 10 + (p.viralBoost ? 50 : 0);
};

const getLevel = (s) =>
  s >= 300 ? "elite" : s >= 180 ? "strong" : s >= 100 ? "good" : "weak";

const getRobots = (s) =>
  s >= 100
    ? "index,follow,max-image-preview:large,max-snippet:-1"
    : "noindex,follow";

/* ================= TRENDING (FAST) ================= */

const getTrending = (list) => {
  return list
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      score:
        safeNumber(p.views) * 0.2 +
        safeNumber(p.clicks) * 0.6 +
        safeNumber(p.orders) * 4 +
        (p.viralBoost ? 80 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

/* ================= PAGE ================= */

export default function ProductPage({ product, relatedProducts }) {
  if (!product) return <div>Product Not Found</div>;

  const title = safeText(product.title);
  const desc = safeText(product.description);
  const image = safeImage(product.image);

  const url = `https://koloonline.online/product/${product.slug || product.id}`;

  const score = calcScore(product);
  const level = getLevel(score);
  const robots = getRobots(score);

  const seoTitle =
    title.length > 58 ? title.slice(0, 55) + "..." : title;

  const seoDesc =
    desc.length > 150 ? desc.slice(0, 147) + "..." : desc;

  const trending = getTrending(relatedProducts || []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    image: [image],
    description: seoDesc,
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

  return (
    <>
      <Head>
        <title>{seoTitle} | Koloonline</title>
        <meta name="description" content={seoDesc} />
        <meta name="robots" content={robots} />
        <link rel="canonical" href={url} />

        {/* 🔥 LCP BOOST */}
        <link rel="preload" as="image" href={image} />
        <link rel="preconnect" href="https://www.koloonline.online" />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={image} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
        <h1>{title}</h1>

        {/* ⚡ OPTIMIZED LCP IMAGE */}
        <Image
          src={image}
          width={820}
          height={540}
          priority
          quality={70}
          alt={title}
          sizes="(max-width: 768px) 100vw, 820px"
          style={{ width: "100%", height: "auto" }}
        />

        <p>{desc}</p>

        <p>
          <strong>Price:</strong> ${safeNumber(product.price)}
        </p>

        <p>
          <strong>Score:</strong> {score.toFixed(0)} ({level})
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
            Buy Now
          </a>
        )}

        {/* 🔥 TRENDING */}
        <section>
          <h2>Trending</h2>

          {trending.map((p) => (
            <Link key={p.id} href={`/product/${p.slug || p.id}`}>
              <div style={{ padding: 6 }}>{p.title}</div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}

/* ================= SSR DATA ================= */

export async function getStaticProps({ params }) {
  const snap = await getDocs(
    query(collection(db, "products"), limit(120))
  );

  const products = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const product =
    products.find((p) => (p.slug || p.id) === params.id) || null;

  if (!product) return { notFound: true };

  return {
    props: {
      product,
      relatedProducts: products.slice(0, 12),
    },
    revalidate: 900,
  };
}

/* ================= PATHS ================= */

export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "products"));

  return {
    paths: snap.docs.slice(0, 150).map((d) => ({
      params: { id: String(d.data().slug || d.id) },
    })),
    fallback: "blocking",
  };
}
