import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300?text=Koloonline";

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  return (
    <>
      <Head>
        <title>
          Koloonline | Trending Amazon Products
        </title>

        <meta
          name="description"
          content="Discover trending Amazon products, smart gadgets, shopping guides and today's best Amazon deals."
        />

        <meta
          name="keywords"
          content="Amazon Deals, Amazon Finds, Trending Products, Smart Gadgets, Buying Guide"
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <meta
          name="theme-color"
          content="#111827"
        />

        <link
          rel="canonical"
          href="https://koloonline.online/"
        />

        {/* Open Graph */}

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

        {/* Twitter */}

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
          content="Discover trending Amazon products and shopping guides."
        />
      </Head>

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: 20,
        }}
      >
        <h1>🔥 Trending Products</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {products.map((p, index) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              prefetch={false}
              style={{
                display: "block",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
                background: "#fff",
              }}
            >
              <Image
                src={
                  p.image && p.image.startsWith("http")
                    ? p.image
                    : FALLBACK_IMAGE
                }
                alt={p.title || "Product"}
                width={220}
                height={220}
                priority={index < 4}
                loading={
                  index < 4 ? "eager" : "lazy"
                }
                sizes="(max-width:768px) 50vw,220px"
                quality={75}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />

              <h2
                style={{
                  fontSize: 18,
                  marginTop: 12,
                }}
              >
                {p.title}
              </h2>

              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                ${p.price}
              </p>
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

    const productsRaw =
      await getProductsFast();

    const products = Array.isArray(productsRaw)
      ? productsRaw
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
      props: {
        products,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error(
      "Home Page Error:",
      error
    );

    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
 
