import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300?text=Koloonline";

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (typeof v === "object") return v?.title || v?.name || "";
  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  return FALLBACK_IMAGE;
};

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  const safeProducts = Array.isArray(products)
    ? products.filter(Boolean)
    : [];

  return (
    <>
      <Head>
        <title>Koloonline | Trending Amazon Products</title>

        <meta
          name="description"
          content="Discover trending Amazon products, smart gadgets and best Amazon deals."
        />

        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://koloonline.online/" />
      </Head>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
        <h1>🔥 Trending Products</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {safeProducts.map((p, index) => {
            const id = safeText(p?.id);
            const title = safeText(p?.title);
            const price = safeNumber(p?.price);
            const image = safeImage(p?.image);

            if (!id) return null;

            return (
              <Link
                key={id}
                href={`/product/${id}`}
                style={{
                  display: "block",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                }}
              >
                <Image
                  src={image}
                  alt={title || "Product"}
                  width={220}
                  height={220}
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                  sizes="220px"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                <h3>{title || "No title"}</h3>

                <p style={{ fontWeight: "bold" }}>
                  ${price}
                </p>
              </Link>
            );
          })}
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
      ? productsRaw.map((p) => ({
          id: String(p?.id || ""),
          title: String(p?.title || ""),
          image: String(p?.image || ""),
          price: Number(p?.price || 0),
        }))
      : [];

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (e) {
    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
            }
