import Head from "next/head";
import { getProductsFast } from "../../lib/firebaseQuery";

export default function Products({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Products | Koloonline</title>
      </Head>

      <h1>🔥 Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 20,
        }}
      >
        {Array.isArray(products) &&
          products.map((p) => {
            const id = typeof p?.id === "string" ? p.id : String(p?.id || "");
            const title =
              typeof p?.title === "string"
                ? p.title
                : String(p?.title || "");

            return (
              <div
                key={id || Math.random()}
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <div>ID: {id}</div>
                <div>Title: {title}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const products = await getProductsFast();

    const clean = Array.isArray(products)
      ? products
          .filter((p) => p && typeof p === "object")
          .map((p) => ({
            id: String(p?.id || ""),
            title:
              typeof p?.title === "string"
                ? p.title
                : String(p?.title || ""),
          }))
      : [];

    return {
      props: {
        products: clean,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Products page error:", error);

    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
                }
