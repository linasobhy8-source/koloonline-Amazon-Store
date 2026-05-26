import Head from "next/head";
import Image from "next/image";

const fallbackImage = "https://via.placeholder.com/500x500?text=Product";

/* SAFE HELPERS */
const safeText = (v) => (typeof v === "string" ? v : "");
const safeImage = (v) =>
  typeof v === "string"
    ? v
    : v?.url || v?.image || fallbackImage;

export default function AliExpressPage({ products = [] }) {
  return (
    <div>
      <Head>
        <title>AliExpress Deals</title>
      </Head>

      <h1>🔥 AliExpress Products</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
        {products.map((product) => {
          const title = safeText(product.title);

          return (
            <div key={product.id} style={{ background: "#fff", padding: 10 }}>
              
              {/* SAFE IMAGE */}
              <img
                src={safeImage(product.image)}
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
