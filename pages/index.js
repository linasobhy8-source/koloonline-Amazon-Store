import Head from "next/head";

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Koloonline</title>
        <meta name="description" content="Trending Products" />
      </Head>

      <h1>🔥 Trending Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {Array.isArray(products) &&
          products.map((p) => (
            <a
              key={p?.id || Math.random()}
              href={`/product/${p?.id || ""}`}
              style={{
                display: "block",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={
                  typeof p?.image === "string" && p.image.length > 5
                    ? p.image
                    : "https://via.placeholder.com/300"
                }
                width={200}
                height={200}
                alt={typeof p?.title === "string" ? p.title : ""}
                loading="lazy"
                style={{ objectFit: "cover" }}
              />

              <h3>
                {typeof p?.title === "string"
                  ? p.title
                  : "No Title"}
              </h3>

              <p>
                $
                {Number.isFinite(Number(p?.price))
                  ? Number(p.price)
                  : 0}
              </p>
            </a>
          ))}
      </div>
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import(
      "../lib/firebaseQuery"
    );

    const productsRaw = await getProductsFast();

    // 🔥 حماية إضافية ضد أي object corrupt
    const products = Array.isArray(productsRaw)
      ? productsRaw
          .filter((p) => p && typeof p === "object")
          .map((p) => ({
            id: String(p.id || ""),
            title:
              typeof p.title === "string"
                ? p.title
                : "",
            image:
              typeof p.image === "string"
                ? p.image
                : "",
            price: Number(p.price || 0),
          }))
      : [];

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (e) {
    console.error("Home error:", e);

    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
                  }
