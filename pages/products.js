import Head from "next/head";
import Link from "next/link";
import useProducts from "../hooks/useProducts";
import { safeText, safeImage } from "../lib/safe";

export default function Products() {
  const { products = [], loading } = useProducts();

  const title = "Trending Products | Koloonline Store";
  const description =
    "Discover trending Amazon products, best deals, and viral shopping items updated daily.";

  const url = "https://koloonline.online/products";

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* ================= SEO ================= */}
      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: title,
              description,
              url,
            }),
          }}
        />
      </Head>

      {/* ================= PAGE CONTENT ================= */}
      <h1>🔥 Trending Products</h1>

      <p style={{ color: "#666", maxWidth: 700 }}>
        Explore our curated list of trending Amazon products, updated based on
        popularity, user engagement, and real-time demand signals.
      </p>

      {/* IMPORTANT SEO TEXT BLOCK */}
      <div style={{ margin: "20px 0", padding: 10, background: "#f5f5f5" }}>
        <strong>Why this page matters:</strong>
        <p>
          This page highlights the most popular and trending products on
          Koloonline, helping users quickly find high-demand items and best
          deals available on Amazon.
        </p>
      </div>

      {/* ================= PRODUCTS ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : !Array.isArray(products) || products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 15,
          }}
        >
          {products.map((p) => (
            <Link key={p?.id} href={`/product/${p?.id}`}>
              <div
                style={{
                  border: "1px solid #eee",
                  padding: 10,
                  borderRadius: 10,
                  background: "#fff",
                }}
              >
                <img
                  src={safeImage(p?.image)}
                  alt={safeText(p?.title)}
                  width={120}
                  height={120}
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                />

                <p style={{ fontSize: 14, marginTop: 8 }}>
                  {safeText(p?.title)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
          }
