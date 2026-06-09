import Head from "next/head";

const fallbackImage = "https://via.placeholder.com/500x500?text=Product";

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

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

  // Firebase Timestamp or similar
  if (v && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  // prevent object crash
  return "";
};

const safeImage = (v) => {
  if (typeof v === "string") {
    const img = v.trim();
    if (img.startsWith("http")) return img;
  }

  if (v && typeof v === "object") {
    if (typeof v.url === "string") return v.url;
    if (typeof v.image === "string") return v.image;
  }

  return fallbackImage;
};

/* ================= PAGE ================= */
export default function AliExpressPage({ products = [] }) {
  return (
    <div>
      <Head>
        <title>AliExpress Deals</title>
        <meta name="description" content="Best AliExpress products deals" />
      </Head>

      <h1>🔥 AliExpress Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 20,
        }}
      >
        {Array.isArray(products) &&
          products.map((product) => {
            const title = safeText(product?.title);
            const img = safeImage(product?.image);

            return (
              <div
                key={product?.id || Math.random()}
                style={{ background: "#fff", padding: 10 }}
              >
                <img
                  src={img}
                  alt={title}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />

                <h3>{title}</h3>
              </div>
            );
          })}
      </div>
    </div>
  );
    }
