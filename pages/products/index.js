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
      products.map((p) => (
        <div
          key={String(p?.id || "")}
          style={{
            border: "1px solid #ddd",
            padding: 10,
          }}
        >
          <div>ID: {String(p?.id || "")}</div>
          <div>Title: {String(p?.title || "")}</div>
        </div>
      ))}
  </div>
</div>

);
}

export async function getStaticProps() {
try {
const products = await getProductsFast();

const clean = Array.isArray(products)
  ? products
      .filter((p) => p && typeof p === "object")
      .map((p) => ({
        id: String(p?.id || ""),
        title: String(p?.title || ""),
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
