import Head from "next/head";

function safeString(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

export default function SEOHead(props) {
  const title = safeString(props?.title, "Koloonline");
  const description = safeString(
    props?.description,
    "Best Amazon Deals, Reviews & Buying Guides"
  );
  const image = safeString(
    props?.image,
    "https://via.placeholder.com/1200x630?text=Koloonline"
  );
  const url = safeString(
    props?.url,
    "https://koloonline.online"
  );

  const siteName = "Koloonline";

  return (
    <Head>

      {/* ================= BASIC SEO ================= */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={url} />

      {/* ================= OPEN GRAPH (FACEBOOK + WHATSAPP) ================= */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />

      {/* ================= TWITTER CARDS ================= */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ================= AD SENSE FRIENDLY META ================= */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />

      {/* ================= STRUCTURED DATA (GOOGLE RICH RESULTS) ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description: description,
            url: url,
            image: image,
            publisher: {
              "@type": "Organization",
              name: siteName,
            },
          }),
        }}
      />
    </Head>
  );
    }
