import Head from "next/head";

const fallbackImage =
"https://via.placeholder.com/500x500?text=Product";

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

if (v && typeof v.toDate === "function") {
try {
return v.toDate().toISOString();
} catch {
return "";
}
}

return "";
};

const safeImage = (v) => {
if (typeof v === "string") {
const img = v.trim();

if (img.startsWith("http")) {
  return img;
}

}

if (v && typeof v === "object") {
if (
typeof v.url === "string" &&
v.url.startsWith("http")
) {
return v.url;
}

if (
  typeof v.image === "string" &&
  v.image.startsWith("http")
) {
  return v.image;
}

}

return fallbackImage;
};

/* ================= PAGE ================= */
export default function AliExpressPage({
products = [],
}) {
const safeProducts = Array.isArray(products)
? products
: [];

return (
<div style={{ padding: 20 }}>
<Head>
<title>AliExpress Deals</title>

    <meta
      name="description"
      content="Best AliExpress products deals"
    />
  </Head>

  <h1>🔥 AliExpress Products</h1>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(200px,1fr))",
      gap: 20,
    }}
  >
    {safeProducts.map((product, index) => {
      const id =
        safeText(product?.id) ||
        `product-${index}`;

      const title = safeText(product?.title);

      const img = safeImage(product?.image);

      return (
        <div
          key={id}
          style={{
            background: "#fff",
            padding: 10,
          }}
        >
          <img
            src={img}
            alt={title || "Product"}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
            }}
            loading="lazy"
          />

          <h3>{title || "No Title"}</h3>
        </div>
      );
    })}
  </div>
</div>

);
              }
