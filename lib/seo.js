/* ================= PRODUCT SEO ================= */

export function getProductSEO(product) {

  const title =
    product?.title ||
    "Amazon Product";

  const description =
    product?.description ||
    product?.title ||
    "Best Amazon product deals and reviews.";

  const asin =
    product?.asin ||
    "product";

  const image =
    product?.image ||
    "/placeholder.png";

  const price =
    product?.price || 0;

  const category =
    product?.category ||
    "Amazon Products";

  return {

    title:
      `${title} | Koloonline`,

    description,

    canonical:
      `https://koloonline.online/product/${asin}`,

    openGraph: {

      title,

      description,

      url:
        `https://koloonline.online/product/${asin}`,

      images: [
        {
          url: image,
        },
      ],

      type: "website",

      site_name:
        "Koloonline",
    },

    twitter: {

      card:
        "summary_large_image",

      title,

      description,

      image,
    },

    schema: {

      "@context":
        "https://schema.org",

      "@type":
        "Product",

      name: title,

      image,

      description,

      category,

      offers: {

        "@type":
          "Offer",

        priceCurrency:
          "USD",

        price:
          String(price),

        availability:
          "https://schema.org/InStock",
      },
    },
  };
}

/* ================= CATEGORY SEO ================= */

export function getCategorySEO(category) {

  const safeCategory =
    category || "Products";

  const description =
    `Explore trending ${safeCategory} products, Amazon deals, viral gadgets, and smart shopping recommendations on Koloonline.`;

  return {

    title:
      `${safeCategory} Products | Koloonline`,

    description,

    canonical:
      `https://koloonline.online/category/${safeCategory}`,

    openGraph: {

      title:
        `${safeCategory} Products`,

      description,

      url:
        `https://koloonline.online/category/${safeCategory}`,

      type: "website",

      site_name:
        "Koloonline",
    },

    twitter: {

      card:
        "summary_large_image",

      title:
        `${safeCategory} Products`,

      description,
    },

    schema: {

      "@context":
        "https://schema.org",

      "@type":
        "CollectionPage",

      name:
        `${safeCategory} Products`,

      description,

      url:
        `https://koloonline.online/category/${safeCategory}`,
    },
  };
        }
