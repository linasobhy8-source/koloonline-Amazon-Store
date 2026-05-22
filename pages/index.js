import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { db } from "../config/firebase";

/* ================= SAFE TREND SCORE ================= */
function calculateTrendScore(product) {
  return (
    (product.views || 0) * 1 +
    (product.clicks || 0) * 3 +
    (product.orders || 0) * 8 +
    (product.rating || 4.5) * 20 +
    (product.viralBoost ? 80 : 0)
  );
}

/* ================= SEO SCHEMA ================= */
function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Koloonline",
    url: "https://koloonline.online",
    description:
      "AI-powered Amazon affiliate platform for trending products and smart shopping deals.",
  };
}

function generateItemListSchema(products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://koloonline.online/product/${p.asin || p.id}`,
      name: p.title,
    })),
  };
}

/* ================= HERO ================= */
function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "white",
        padding: "80px 20px",
        borderRadius: 24,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ flex: 1, minWidth: 300 }}>
          <span
            style={{
              background: "#ff9900",
              padding: "8px 16px",
              borderRadius: 30,
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            🔥 Trending Amazon Products
          </span>

          <h1
            style={{
              fontSize: 52,
              lineHeight: 1.1,
              marginTop: 25,
              marginBottom: 20,
            }}
          >
            Discover Viral Amazon Deals Before Everyone Else
          </h1>

          <p
            style={{
              fontSize: 19,
              color: "#cbd5e1",
              lineHeight: 1.8,
              maxWidth: 650,
            }}
          >
            AI-powered Amazon discovery platform helping
            shoppers find trending gadgets, smart home
            products, viral items, and the best online deals.
          </p>

          <div
            style={{
              display: "flex",
              gap: 15,
              flexWrap: "wrap",
              marginTop: 30,
            }}
          >
            <Link href="/products">
              <button
                style={{
                  padding: "16px 30px",
                  borderRadius: 12,
                  border: "none",
                  background: "#ff9900",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                🛒 Explore Products
              </button>
            </Link>

            <Link href="/blog">
              <button
                style={{
                  padding: "16px 30px",
                  borderRadius: 12,
                  border: "1px solid #334155",
                  background: "transparent",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                📚 Buying Guides
              </button>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginTop: 35,
              color: "#cbd5e1",
              fontSize: 14,
            }}
          >
            <span>✅ Updated Daily</span>
            <span>✅ AI Ranked</span>
            <span>✅ Viral Products</span>
            <span>✅ Smart Recommendations</span>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div
          style={{
            flex: 1,
            minWidth: 300,
            textAlign: "center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"
            alt="Trending Amazon Products"
            style={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 24,
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */
function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.asin || product.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.06)",
          transition: "0.3s",
          height: "100%",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            position: "relative",
            background: "#f8fafc",
            padding: 20,
          }}
        >
          {product.viralBoost && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background:
                  "linear-gradient(45deg,#ff0000,#ff6600)",
                color: "white",
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: "bold",
                zIndex: 2,
              }}
            >
              🔥 Viral
            </div>
          )}

          <Image
            src={
              product.image ||
              "https://via.placeholder.com/500"
            }
            alt={product.title || "Product"}
            width={400}
            height={400}
            unoptimized
            style={{
              width: "100%",
              height: 240,
              objectFit: "contain",
            }}
          />
        </div>

        {/* CONTENT */}
        <div style={{ padding: 20 }}>
          <h3
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              color: "#111827",
              height: 55,
              overflow: "hidden",
            }}
          >
            {product.title}
          </h3>

          {/* STARS */}
          <div
            style={{
              marginTop: 10,
              color: "#f59e0b",
              fontSize: 14,
            }}
          >
            ⭐⭐⭐⭐⭐
            <span
              style={{
                color: "#6b7280",
                marginLeft: 8,
              }}
            >
              {product.rating || 4.5}/5
            </span>
          </div>

          {/* PRICE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 14,
            }}
          >
            <h2
              style={{
                color: "#dc2626",
                fontSize: 28,
                margin: 0,
              }}
            >
              ${product.price || 0}
            </h2>

            <span
              style={{
                textDecoration: "line-through",
                color: "#9ca3af",
              }}
            >
              $
              {Math.floor(
                (product.price || 50) * 1.3
              )}
            </span>
          </div>

          {/* BUTTON */}
          <button
            style={{
              width: "100%",
              marginTop: 18,
              padding: 14,
              borderRadius: 12,
              border: "none",
              background:
                "linear-gradient(45deg,#ff9900,#ff6600)",
              color: "white",
              fontWeight: "bold",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            🛒 View Deal
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ================= MAIN PAGE ================= */
export default function Home({ products }) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        p.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      .map((p) => ({
        ...p,
        trendScore: calculateTrendScore(p),
      }))
      .sort((a, b) => b.trendScore - a.trendScore);
  }, [products, search]);

  const trendingProducts =
    filteredProducts.slice(0, 12);

  const websiteSchema =
    generateWebsiteSchema();

  const itemListSchema =
    generateItemListSchema(
      trendingProducts
    );

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>
          Koloonline - Best Amazon Deals &
          Trending Products 2026
        </title>

        <meta
          name="description"
          content="Discover trending Amazon products, viral gadgets, AI-ranked deals, and smart shopping recommendations."
        />

        <meta
          name="keywords"
          content="amazon deals, trending products, viral amazon gadgets, best amazon finds"
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href="https://koloonline.online"
        />

        {/* OPEN GRAPH */}
        <meta
          property="og:title"
          content="Koloonline Smart Shopping Platform"
        />

        <meta
          property="og:description"
          content="Trending Amazon products & AI-powered deals."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content="https://koloonline.online"
        />

        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"
        />

        {/* SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              websiteSchema
            ),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              itemListSchema
            ),
          }}
        />
      </Head>

      {/* ================= NAVBAR ================= */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#111827",
                fontSize: 30,
              }}
            >
              🟠 Koloonline
            </h1>
          </Link>

          {/* SEARCH */}
          <div
            style={{
              flex: 1,
              maxWidth: 500,
            }}
          >
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search trending products..."
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 14,
                border: "1px solid #d1d5db",
                outline: "none",
                fontSize: 15,
              }}
            />
          </div>

          {/* MENU */}
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <Link href="/products">
              Products
            </Link>

            <Link href="/categories">
              Categories
            </Link>

            <Link href="/blog">
              Blog
            </Link>

            <Link href="/about">
              About
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: 20,
        }}
      >
        <Hero />

        {/* ================= TITLE ================= */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 25,
            marginTop: 20,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 38,
                marginBottom: 10,
                color: "#111827",
              }}
            >
              🔥 Trending Products
            </h2>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              AI-ranked viral Amazon finds
              updated daily.
            </p>
          </div>

          <Link href="/products">
            <button
              style={{
                padding: "14px 22px",
                borderRadius: 12,
                border: "none",
                background: "#111827",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View All
            </button>
          </Link>
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 24,
          }}
        >
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* ================= BLOG SECTION ================= */}
        <section
          style={{
            marginTop: 80,
            background: "white",
            padding: 35,
            borderRadius: 24,
          }}
        >
          <h2
            style={{
              fontSize: 36,
              marginBottom: 20,
            }}
          >
            📚 Latest Buying Guides
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: 20,
            }}
          >
            {[
              {
                title: "Best Smart Watches",
                slug: "best-smart-watches",
              },

              {
                title: "Best Headphones 2026",
                slug: "best-headphones-2026",
              },

              {
                title: "Viral Amazon Products",
                slug: "viral-products-amazon",
              },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    background: "#f8fafc",
                    padding: 24,
                    borderRadius: 18,
                    border:
                      "1px solid #e5e7eb",
                  }}
                >
                  <h3
                    style={{
                      color: "#111827",
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    Read smart shopping guide →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section
          style={{
            marginTop: 60,
            padding: 40,
            borderRadius: 24,
            background:
              "linear-gradient(135deg,#111827,#1f2937)",
            color: "white",
          }}
        >
          <h2
            style={{
              fontSize: 38,
            }}
          >
            Why Koloonline?
          </h2>

          <p
            style={{
              marginTop: 20,
              lineHeight: 1.9,
              color: "#d1d5db",
              maxWidth: 900,
            }}
          >
            Koloonline uses AI-driven trend analysis,
            affiliate intelligence, smart product
            ranking, and shopping behavior analytics to
            help users discover the best Amazon deals
            faster.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
              marginTop: 40,
            }}
          >
            {[
              "🔥 Viral Product Detection",
              "⚡ Fast Daily Updates",
              "🧠 AI Recommendation Engine",
              "📈 Trend Ranking System",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background:
                    "rgba(255,255,255,0.06)",
                  padding: 24,
                  borderRadius: 18,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= STATIC DATA ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(
      query(
        collection(db, "products"),
        limit(60)
      )
    );

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      asin: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        products,
      },

      revalidate: 60,
    };
  } catch (err) {
    console.error("HOME ERROR:", err);

    return {
      props: {
        products: [],
      },

      revalidate: 60,
    };
  }
}
