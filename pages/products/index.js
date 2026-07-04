import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getProductsFast } from "../../lib/firebaseQuery";
import { safeText, safeImage, safeNumber } from "../../lib/safeProduct";

/* ================= CONFIG ================= */
const SITE_URL = "https://koloonline.online";

/* ================= SEO SCHEMA (static) ================= */
const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Koloonline Products",
  url: `${SITE_URL}/products`,
  description:
    "Browse trending Amazon products selected by the Koloonline AI engine.",
};

/* ================= COMPONENT ================= */
export default function Products({ products = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <>
      <Head>
        <title>Products | Koloonline</title>

        <meta
          name="description"
          content="Browse trending Amazon products selected by the Koloonline AI engine."
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />

        <link rel="canonical" href={`${SITE_URL}/products`} />

        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Koloonline Products" />
        <meta
          property="og:description"
          content="Browse trending Amazon products selected by AI."
        />
        <meta property="og:url" content={`${SITE_URL}/products`} />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: 20,
        }}
      >
        <header>
          <h1>🔥 Products</h1>
          <p style={{ opacity: 0.7, marginTop: 6 }}>
            AI-ranked trending Amazon products
          </p>
        </header>

        {/* GRID */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          {safeProducts.map((p, index) => {
            if (!p?.id) return null;

            const id = safeText(p.id);
            const title = safeText(p.title);
            const image = safeImage(p.image);
            const price = safeNumber(p.price);

            return (
              <article
                key={id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  background: "#fff",
                  overflow: "hidden",
                  willChange: "transform",
                }}
              >
                <Link
                  href={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {/* IMAGE (LCP OPTIMIZED) */}
                  <div style={{ position: "relative", width: "100%", height: 220 }}>
                    <Image
                      src={image}
                      alt={title || "Product"}
                      fill
                      priority={index < 2}   // 🔥 LCP BOOST
                      sizes="(max-width:768px) 50vw, 220px"
                      quality={75}
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      style={{
                        objectFit: "contain",
                        padding: 10,
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div style={{ padding: 12 }}>
                    <h2
                      style={{
                        fontSize: 14,
                        lineHeight: "1.4",
                        minHeight: 40,
                      }}
                    >
                      {title || "Untitled Product"}
                    </h2>

                    <p
                      style={{
                        fontWeight: 700,
                        color: "#ff9900",
                        marginTop: 8,
                      }}
                    >
                      ${price}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const raw = await getProductsFast();

    const products = Array.isArray(raw)
      ? raw
          .filter((p) => p && typeof p === "object")
          .map((p) => ({
            id: String(p?.id || ""),
            title: typeof p?.title === "string" ? p.title : "",
            image:
              typeof p?.image === "string"
                ? p.image
                : `${SITE_URL}/logo.png`,
            price: Number(p?.price || 0),
          }))
          .filter((p) => p.id) // 🔥 clean invalid products
      : [];

    return {
      props: {
        products,
      },
      revalidate: 300, // ⚡ fast ISR for freshness + SEO
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
