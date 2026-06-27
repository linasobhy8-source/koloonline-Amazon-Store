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
  const id = safeText(productId);

  const pageTitle =
    id ? `Amazon Product ${id} | Koloonline` : "Amazon Product | Koloonline";

  const pageDescription = id
    ? `View Amazon product ${id}, reviews, price and buying guide on Koloonline.`
    : "Discover Amazon products and deals on Koloonline.";

  const pageUrl = `https://koloonline.online/product/${id}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="Amazon Product, Deals, Reviews, Buying Guide"
        />

        <meta name="robots" content="index,follow,max-image-preview:large" />

        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:image"
          content="https://koloonline.online/favicon.ico"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: pageTitle,
              url: pageUrl,
              image: "https://koloonline.online/favicon.ico",
              brand: {
                "@type": "Organization",
                name: "Koloonline",
              },
            }),
          }}
        />
      </Head>

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 20,
        }}
      >
        <h1>{pageTitle}</h1>
        <p>
          <strong>Product ID:</strong> {id}
        </p>
      </main>
    </>
  );
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  return {
    props: {
      productId: params?.id || "",
    },
    revalidate: 300,
  };
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "B0GWTCCHFZ" } }],
    fallback: "blocking",
  };
            }
