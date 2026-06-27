import Head from "next/head";

/* ================= SAFE ================= */

const safeText = (value) => {
  if (value === null || value === undefined) return "";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(safeText).join(" ");
  }

  if (typeof value === "object") {
    return (
      value.title ||
      value.name ||
      value.text ||
      ""
    );
  }

  return "";
};

/* ================= PAGE ================= */

export default function ProductPage({
  productId,
}) {
  const id = safeText(productId);

  const pageTitle =
    id.length > 0
      ? `Amazon Product ${id} | Koloonline`
      : "Amazon Product | Koloonline";

  const pageDescription =
    id.length > 0
      ? `View Amazon product ${id}, specifications, reviews and buying guide on Koloonline.`
      : "Discover Amazon products on Koloonline.";

  const pageUrl = `https://koloonline.online/product/${id}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta
          name="description"
          content={pageDescription}
        />

        <meta
          name="keywords"
          content="Amazon Product, Amazon Deals, Product Review, Buying Guide"
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href={pageUrl}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="product"
        />

        <meta
          property="og:title"
          content={pageTitle}
        />

        <meta
          property="og:description"
          content={pageDescription}
        />

        <meta
          property="og:url"
          content={pageUrl}
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
          content={pageTitle}
        />

        <meta
          name="twitter:description"
          content={pageDescription}
        />

        {/* Structured Data */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: pageTitle,
              url: pageUrl,
              image:
                "https://koloonline.online/favicon.ico",
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

export async function getStaticProps({
  params,
}) {
  return {
    props: {
      productId:
        typeof params?.id === "string"
          ? params.id
          : "",
    },
    revalidate: 300,
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
    fallback: "blocking",
  };
            }
