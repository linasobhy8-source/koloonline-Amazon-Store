import Head from "next/head";

/* ================= SAFE ================= */
const safeText = (value) => {
  if (value == null) return "";

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
    return value.title || value.name || value.text || "";
  }

  return "";
};

/* ================= PAGE ================= */
export default function ProductPage({ productId }) {
  const id = safeText(productId);

  const siteName = "Koloonline";

  const pageTitle = id
    ? `Amazon Product ${id} | ${siteName}`
    : `${siteName} Product`;

  const pageDescription = id
    ? `View Amazon product ${id}, reviews, price insights and buying guide on ${siteName}.`
    : `Discover Amazon products, reviews and deals on ${siteName}.`;

  const pageUrl = `https://koloonline.online/product/${id}`;

  const imageUrl =
    "https://koloonline.online/favicon.ico";

  return (
    <>
      <Head>
        {/* ================= BASIC SEO ================= */}
        <title>{pageTitle}</title>

        <meta
          name="description"
          content={pageDescription}
        />

        <meta
          name="keywords"
          content="Amazon Product, Deals, Reviews, Buying Guide, Smart Shopping"
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href={pageUrl}
        />

        <meta
          name="theme-color"
          content="#111827"
        />

        {/* ================= OPEN GRAPH ================= */}
        <meta
          property="og:type"
          content="product"
        />

        <meta
          property="og:site_name"
          content={siteName}
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
