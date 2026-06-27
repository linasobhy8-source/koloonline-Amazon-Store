import Head from "next/head";
import Image from "next/image";

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  return (
    <>
      <Head>
        <title>Koloonline</title>
        <meta
          name="description"
          content="Discover trending Amazon products, best deals, and top recommendations."
        />
        <link rel="canonical" href="https://koloonline.online/" />
      </Head>

      <main style={{ padding: 20 }}>
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
                key={p.id}
                href={`/product/${p.id}`}
                style={{
                  display: "block",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Image
                  src={
                    p.image && p.image.length > 5
                      ? p.image
                      : "https://via.placeholder.com/300"
                  }
                  alt={p.title || "Product"}
                  width={200}
                  height={200}
                  loading="lazy"
                  sizes="200px"
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                <h3>{p.title || "No Title"}</h3>

                <p>${Number(p.price || 0)}</p>
              </a>
            ))}
        </div>
      </main>
    </>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import(
      "../lib/firebaseQuery"
    );

    const productsRaw = await getProductsFast();

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
      props: {
        products,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Home error:", error);

    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
}
