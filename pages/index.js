import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SAFE HELPERS ================= */

const FALLBACK_IMAGE =
"https://via.placeholder.com/300x300?text=Koloonline";

function safeText(v) {
if (v == null) return "";

if (
typeof v === "string" ||
typeof v === "number" ||
typeof v === "boolean"
) {
return String(v);
}

if (Array.isArray(v)) {
return v.map(safeText).join(" ");
}

if (typeof v === "object") {
return String(
v.title ||
v.name ||
v.text ||
v.value ||
""
);
}

return "";
}

function safeImage(v) {
if (!v) return FALLBACK_IMAGE;

if (typeof v === "string") {
return v.startsWith("http")
? v
: FALLBACK_IMAGE;
}

if (typeof v === "object") {
const img =
v.url ||
v.image ||
v.src ||
v.value;

if (
  typeof img === "string" &&
  img.startsWith("http")
) {
  return img;
}

}

return FALLBACK_IMAGE;
}

function safeNumber(v) {
const n = Number(v);
return Number.isFinite(n) ? n : 0;
}

function viralScore(p = {}) {
let score = 0;

score += safeNumber(p.views) * 0.5;
score += safeNumber(p.clicks) * 2;
score += safeNumber(p.addToCart) * 5;
score += safeNumber(p.orders) * 10;
score += safeNumber(p.rating) * 20;

if (p.trending) score += 50;
if (p.viralBoost) score += 40;

return Math.round(score);
}

/* ================= PAGE ================= */

export default function HomePage({
products = [],
}) {
return (
<>
<Head>
<title>
Trending Products | Koloonline
</title>

    <meta
      name="description"
      content="Trending Amazon products and viral deals."
    />
  </Head>

  <div
    style={{
      padding: 20,
    }}
  >
    <h1>
      🔥 Viral & Trending Products
    </h1>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
      }}
    >
      {products.map((p) => (
        <Link
          key={String(p.id)}
          href={`/product/${encodeURIComponent(
            String(p.id)
          )}`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Image
              src={safeImage(p.image)}
              alt={safeText(p.title)}
              width={300}
              height={300}
              unoptimized
            />

            <h3>
              {safeText(p.title)}
            </h3>

            <p>
              Score:{" "}
              {safeNumber(
                p.viralScore
              )}
            </p>

            <p>
              $
              {safeNumber(
                p.price
              )}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</>

);
}

/* ================= DATA ================= */

export async function getStaticProps() {
try {
const snap = await getDocs(
collection(db, "products")
);

const products = snap.docs
  .map((doc) => {
    const data = doc.data() || {};

    return {
      id: String(doc.id),
      title: safeText(data.title),
      image: safeImage(data.image),
      price: safeNumber(data.price),
      views: safeNumber(data.views),
      clicks: safeNumber(data.clicks),
      orders: safeNumber(data.orders),
      rating: safeNumber(data.rating),
      trending: !!data.trending,
      viralBoost: !!data.viralBoost,
    };
  })
  .map((p) => ({
    ...p,
    viralScore: viralScore(p),
  }))
  .sort(
    (a, b) =>
      b.viralScore - a.viralScore
  );

return {
  props: {
    products,
  },
  revalidate: 1800,
};

} catch (error) {
console.error(
"HOME ERROR:",
error
);

return {
  props: {
    products: [],
  },
  revalidate: 300,
};

}
                    }
