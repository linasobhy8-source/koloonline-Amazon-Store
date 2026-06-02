import Head from "next/head";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Product";

/* ================= SAFE HELPERS ================= */
const safeText = (v) =>
  typeof v === "string" ? v : "";

const safeImage = (v) =>
  typeof v === "string"
    ? v
    : v?.url || v?.image || fallbackImage;

/* ================= PAGE ================= */
export default function AmazonHaul({ products = [] }) {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      
      {/* ================= SEO ================= */}
      <Head>
        <title>Amazon Haul | Trending Deals</title>
        <meta
          name="description"
          content="Discover trending Amazon Haul deals and viral products."
        />
        <meta name="robots" content="index,follow" />
      </Head>

      <h1>🔥 Amazon Haul Deals</h1>

      {/* ================= GRID ================= */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {products.map((product) => {
          const title = safeText(product.title);
          const image = safeImage(product.image);

          return (
            <div
              key={product.id || title}
              style={{
                background: "#fff",
                padding: 15,
                borderRadius: 10,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              {/* IMAGE */}
              <img
                src={image}
                alt={title || "product"}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
                loading="lazy"
              />

              {/* TITLE */}
              <div style={{ marginTop: 10 }}>
                <h3 style={{ fontSize: 16 }}>
                  {title || "No title"}
                </h3>

                {/* VIRAL BADGE */}
                {product.viralBoost ? (
                  <span
                    style={{
                      color: "white",
                      background: "red",
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    🔥 Viral
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
                  }
