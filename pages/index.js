import Head from "next/head";
import Link from "next/link";
import SmartImage from "../components/SmartImage";

/* ================= HOME PAGE ================= */
export default function Home({ products = [] }) {
  return (
    <>
      <Head>
        {/* ================= SEO ================= */}
        <title>Koloonline | Trending Amazon Products</title>

        <meta
          name="description"
          content="Discover trending Amazon products, smart gadgets, deals and buying guides updated daily."
        />

        <meta
          name="keywords"
          content="Amazon Deals, Trending Products, Smart Gadgets, Buying Guide, Reviews"
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href="https://koloonline.online/"
        />

        {/* ================= OPEN GRAPH ================= */}
        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="Koloonline"
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
          property="og:image"
          content="https://koloonline.online/favicon.ico"
        />

        {/* ================= TWITTER ================= */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Koloonline | Trending Amazon Products"
        />

        <meta
          name="twitter:description"
          content="Discover trending Amazon products and deals."
        />
      </Head>

      {/* ================= PAGE ================= */}
      <main
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: 20,
        }}
      >
        {/* HERO */}
        <section style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 32 }}>
            🔥 Trending Amazon Products
          </h1>

          <p style={{ color: "#666" }}>
            Best deals, reviews and shopping insights updated daily.
          </p>
        </section>

        {/* PRODUCTS GRID */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {Array.isArray(products) &&
            products.map((p, index) => (
              <Link
                key={p.id || index}
                href={`/product/${p.id}`}
                prefetch={true}
                style={{
                  display: "block",
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                  transition: "0.2s",
                }}
              >
                {/* IMAGE (OPTIMIZED) */}
                <SmartImage
                  src={p.image}
                  alt={p.title}
                  priority={index < 4}
                />

                {/* TITLE */}
                <h2
                  style={{
                    fontSize: 16,
                    marginTop: 10,
                  }}
                >
                  {p.title || "Untitled Product"}
                </h2>

                {/* PRICE */}
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#B12704",
                  }}
                >
                  ${Number(p.price || 0)}
                </p>
              </Link>
            ))}
        </section>
      </main>
    </>
  );
}

/* ================= DATA FETCH ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import(
      "../lib/firebaseQuery"
    );

    const raw = await getProductsFast();

    const products = Array.isArray(raw)
      ? raw
          .filter(
            (p) =>
              p &&
              typeof p === "object" &&
              p.id
          )
          .map((p) => ({
            id: String(p.id),
            title: String(p.title || ""),
            image: String(p.image || ""),
            price: Number(p.price || 0),
          }))
      : [];

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Index Error:", error);

    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
            }
