import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= FALLBACK IMAGE ================= */
const fallbackImage =
  "https://via.placeholder.com/300x300?text=Koloonline";

/* ================= IMAGE OPTIMIZER ================= */
function optimizeImage(src) {
  if (!src) return fallbackImage;

  if (src.includes("amazon")) {
    return src.replace("http://", "https://");
  }

  return src;
}

/* ================= PAGE ================= */
export default function ProductsPage({ products }) {
  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: 20,
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>All Products | Koloonline Deals</title>

        <meta
          name="description"
          content="Browse trending Amazon products, deals and offers updated daily."
        />

        <meta
          name="keywords"
          content="amazon deals, gadgets, smart watch, electronics, trending products"
        />

        <meta name="robots" content="index,follow" />

        <link rel="canonical" href="https://koloonline.online/products" />

        <meta property="og:title" content="All Products | Koloonline Deals" />
        <meta
          property="og:description"
          content="Browse trending Amazon products and daily deals."
        />
        <meta property="og:url" content="https://koloonline.online/products" />
        <meta property="og:type" content="website" />
      </Head>

      <h1>🔥 All Products</h1>

      <p>
        Discover trending Amazon products, gadgets, smart watches, electronics
        and daily deals.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 25,
        }}
      >
        {products.map((p, index) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            prefetch={false}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <article
              style={{
                background: "#fff",
                padding: 12,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                height: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 250,
                  background: "#fff",
                }}
              >
                <Image
                  src={optimizeImage(p.image)}
                  alt={p.title || "Product"}
                  fill
                  priority={index < 4}
                  quality={75}
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={fallbackImage}
                  style={{ objectFit: "contain" }}
                />
              </div>

              <h2
                style={{
                  fontSize: 16,
                  marginTop: 12,
                  minHeight: 45,
                }}
              >
                {p.title}
              </h2>

              <p
                style={{
                  color: "#B12704",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                ${p.price || 0}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= STATIC GENERATION (ISR) ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        products,
      },

      // ✅ ISR caching (1 hour)
      revalidate: 3600,
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        products: [],
      },

      revalidate: 300,
    };
  }
              }
