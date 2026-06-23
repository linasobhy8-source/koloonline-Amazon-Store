import Head from "next/head";

/* ================= SAFE ================= */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (typeof v === "object") return v.title || v.name || v.text || "";
  return "";
};

/* ================= PAGE ================= */
export default function ProductPage({ productId }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Product | Koloonline</title>
      </Head>

      <h1>🛍 Product Page</h1>

      <p>Product ID: {safeText(productId)}</p>
    </div>
  );
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  return {
    props: {
      productId: params?.id || "",
    },
    revalidate: 60,
  };
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          id: "B0GWTCCHFZ",
        },
      },
    ],
    fallback: false,
  };
      }
