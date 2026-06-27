import Head from "next/head";

const FALLBACK_IMAGE =
  "https://koloonline.online/favicon.ico";

function safeString(value, fallback = "") {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

export default function SEOHead({
  title,
  description,
  image,
  url,
  type = "website",
  noindex = false,
}) {
  const siteName = "Koloonline";

  const pageTitle = safeString(title, siteName);

  const pageDescription = safeString(
    description,
    "Discover the best Amazon deals, trending products, buying guides and expert reviews."
  );

  const pageImage = safeString(
    image,
    FALLBACK_IMAGE
  );

  const pageUrl = safeString(
    url,
    "https://koloonline.online"
  );

  return (
    <Head>

      {/* Primary SEO */}
      <title>{pageTitle}</title>

      <meta
        name="description"
        content={pageDescription}
      />

      <meta
        name="robots"
        content={
          noindex
            ? "noindex,nofollow"
            : "index,follow,max-image-preview:large"
        }
      />

      <link
        rel="canonical"
        href={pageUrl}
      />

      <meta
        name="theme-color"
        content="#111827"
      />

      <meta
        name="author"
        content="Koloonline"
      />

      <meta
        name="application-name"
        content="Koloonline"
      />

      {/* Open Graph */}

      <meta
        property="og:type"
        content={type}
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

      <meta
        property="og:image"
        content={pageImage}
      />

      <meta
        property="og:image:width"
        content="1200"
      />

      <meta
        property="og:image:height"
        content="630"
      />

      <meta
        property="og:locale"
        content="en_US"
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

      <meta
        name="twitter:image"
        content={pageImage}
      />

      {/* Mobile */}

      <meta
        name="mobile-web-app-capable"
        content="yes"
      />

      <meta
        name="apple-mobile-web-app-capable"
        content="yes"
      />

      {/* Structured Data */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageTitle,
            description: pageDescription,
            url: pageUrl,
            image: pageImage,
            publisher: {
              "@type": "Organization",
              name: siteName,
              url: "https://koloonline.online",
              logo: {
                "@type": "ImageObject",
                url: "https://koloonline.online/favicon.ico",
              },
            },
          }),
        }}
      />

    </Head>
  );
          }
