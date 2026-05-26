import Head from "next/head";

const fallbackImage = "https://via.placeholder.com/500x500?text=Product";

const safeText = (v) => (typeof v === "string" ? v : "");
const safeImage = (v) =>
  typeof v === "string"
    ? v
    : v?.url || v?.image || fallbackImage;

export default function AmazonHaul({ products = [] }) {
  return (
    <div>
      <Head>
        <title>Amazon Haul</title>
      </Head>

      <h1>🔥 Amazon Haul Deals</h1>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
        {products.map((product) => {
          const title = safeText(product.title);

          return (
            <div key={product.id} style={{ background: "#fff", padding: 15, borderRadius: 10 }}>
              
              {/* SAFE IMAGE */}
              <img
                src={safeImage(product.image)}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
                alt={title}
              />

              <div>
                <h3>{title}</h3>

                {product.viralBoost && (
                  <span style={{ color: "red" }}>🔥 Viral</span>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
