import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  return (
    <>
      <Head>
        <title>Koloonline | Trending Amazon Products</title>

        <meta
          name="description"
          content="Discover trending Amazon products, best deals, smart gadgets, and shopping guides."
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href="https://koloonline.online/"
        />

        <meta
          property="og:title"
          content="Koloonline | Trending Amazon Products"
        />

        <meta
          property="og:description"
          content="Discover trending Amazon products and shopping guides."
        />

        <meta
          property="og:url"
          content="https://koloonline.online/"
        />

        <meta
          property="og:type"
          content="website"
        />
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
          {products.map((p) => (
            <Link
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
                width={220}
                height={220}
                loading="lazy"
                sizes="220px"
                style={{
                  objectFit: "cover",
                  borderRadius: 8,
                  width: "100%",
                  height: "auto",
                }}
              />

              <h3>{p.title}</h3>

              <p>${p.price}</p>
            </Link>
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
            title: String(p.title || ""),
            image: String
