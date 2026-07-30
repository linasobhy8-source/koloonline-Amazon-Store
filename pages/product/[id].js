import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
  collection,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  doc,
} from "firebase/firestore";

import { db } from "../../config/firebase";

const SITE_URL = "https://koloonline.online";
const FALLBACK_IMAGE = `${SITE_URL}/logo.png`;

/* =========================================================
   SAFE HELPERS
========================================================= */

const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v).trim();
  }

  if (Array.isArray(v)) {
    return v.map(safeText).filter(Boolean).join(" ");
  }

  if (v && typeof v === "object") {
    return (
      safeText(v.title) ||
      safeText(v.name) ||
      safeText(v.value) ||
      safeText(v.label) ||
      ""
    );
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (value) => {
  if (typeof value === "string") {
    const image = value.trim();

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const image = safeImage(item);

      if (image !== FALLBACK_IMAGE) {
        return image;
      }
    }
  }

  if (value && typeof value === "object") {
    return (
      safeImage(value.url) !== FALLBACK_IMAGE
        ? safeImage(value.url)
        : safeImage(value.src) !== FALLBACK_IMAGE
        ? safeImage(value.src)
        : safeImage(value.image)
    );
  }

  return FALLBACK_IMAGE;
};

const getProductImage = (product = {}) => {
  return safeImage(
    product.image ||
      product.images ||
      product.imageUrl ||
      product.thumbnail ||
      product["صورة"]
  );
};

const getProductTitle = (product = {}) => {
  return (
    safeText(product.title) ||
    safeText(product.name) ||
    safeText(product["عنوان"]) ||
    "Amazon Product"
  );
};

const getProductCategory = (product = {}) => {
  return (
    safeText(product.category) ||
    safeText(product["فئة"]) ||
    ""
  );
};

const getProductPrice = (product = {}) => {
  return safeNumber(
    product.price ??
      product["سعر"]
  );
};

const getProductLink = (product = {}) => {
  return (
    safeText(product.link) ||
    safeText(product.url) ||
    safeText(product["وصلة"]) ||
    ""
  );
};

const getProductBrand = (product = {}) => {
  return (
    safeText(product.brand) ||
    safeText(product.brandName) ||
    safeText(product.manufacturer) ||
    safeText(product["العلامة التجارية"]) ||
    ""
  );
};

const getProductCurrency = (product = {}) => {
  return (
    safeText(product.currency) ||
    safeText(product.priceCurrency) ||
    "USD"
  );
};

const getProductRating = (product = {}) => {
  const rating = safeNumber(
    product.rating ??
      product["rating"] ??
      product["التقييم"]
  );

  return rating > 0 && rating <= 5 ? rating : 0;
};

const getProductReviewCount = (product = {}) => {
  return safeNumber(
    product.reviewCount ??
      product.reviewsCount ??
      product.reviews ??
      product["عدد المراجعات"] ??
      0
  );
};

const getProductAvailability = (product = {}) => {
  const value = safeText(
    product.availability
  ).toLowerCase();

  if (value.includes("out")) {
    return "https://schema.org/OutOfStock";
  }

  if (value.includes("pre")) {
    return "https://schema.org/PreOrder";
  }

  if (value.includes("back")) {
    return "https://schema.org/BackOrder";
  }

  return "https://schema.org/InStock";
};

/* =========================================================
   AI SCORE
========================================================= */

const calcScore = (product = {}) => {
  const views = safeNumber(
    product.views ??
      product["المشاهدات"]
  );

  const clicks = safeNumber(
    product.clicks ??
      product["نقرات"]
  );

  const orders = safeNumber(
    product.orders ??
      product["الطلبات"]
  );

  const rating = getProductRating(product);

  const viralBoost =
    product.viralBoost ??
    product["تعزيز الانتشار الفيروسي"];

  return (
    views * 0.2 +
    clicks * 0.7 +
    orders * 5 +
    rating * 12 +
    (viralBoost ? 80 : 0)
  );
};

const getLevel = (score) => {
  if (score >= 350) return "elite";
  if (score >= 220) return "strong";
  if (score >= 120) return "good";

  return "normal";
};

const getRobots = () =>
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

/* =========================================================
   PRODUCT LOOKUP
========================================================= */

async function findProduct(id) {
  const productsRef = collection(db, "products");
  const normalizedId = String(id || "").trim();

  if (!normalizedId) {
    return null;
  }

  /* 1) Direct document ID */

  try {
    const directRef = doc(
      db,
      "products",
      normalizedId
    );

    const directSnap =
      await getDoc(directRef);

    if (directSnap.exists()) {
      return {
        id: directSnap.id,
        ...directSnap.data(),
      };
    }
  } catch (error) {
    console.error(
      "Direct product lookup failed:",
      error
    );
  }

  /* 2) ASIN */

  try {
    const asinSnap = await getDocs(
      query(
        productsRef,
        where("asin", "==", normalizedId),
        limit(1)
      )
    );

    if (!asinSnap.empty) {
      const item = asinSnap.docs[0];

      return {
        id: item.id,
        ...item.data(),
      };
    }
  } catch (error) {
    console.error(
      "ASIN lookup failed:",
      error
    );
  }

  /* 3) Slug */

  try {
    const slugSnap = await getDocs(
      query(
        productsRef,
        where("slug", "==", normalizedId),
        limit(1)
      )
    );

    if (!slugSnap.empty) {
      const item = slugSnap.docs[0];

      return {
        id: item.id,
        ...item.data(),
      };
    }
  } catch (error) {
    console.error(
      "Slug lookup failed:",
      error
    );
  }

  return null;
}

/* =========================================================
   RELATED PRODUCTS
========================================================= */

async function fetchProductsByField(
  field,
  value,
  max = 20
) {
  if (!value) return [];

  try {
    const snap = await getDocs(
      query(
        collection(db, "products"),
        where(field, "==", value),
        limit(max)
      )
    );

    return snap.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error(
      `Related query failed for ${field}:`,
      error
    );

    return [];
  }
}

async function getRelatedProducts(product) {
  try {
    const category =
      getProductCategory(product);

    let related = [];

    /* -----------------------------------------------
       1) English category
    ----------------------------------------------- */

    if (category) {
      related = await fetchProductsByField(
        "category",
        category,
        20
      );
    }

    /* -----------------------------------------------
       2) Arabic category field
    ----------------------------------------------- */

    if (related.length <= 1 && category) {
      const arabicRelated =
        await fetchProductsByField(
          "فئة",
          category,
          20
        );

      related = [
        ...related,
        ...arabicRelated,
      ];
    }

    /* -----------------------------------------------
       3) General fallback
    ----------------------------------------------- */

    if (related.length <= 1) {
      try {
        const fallbackSnap =
          await getDocs(
            query(
              collection(db, "products"),
              limit(30)
            )
          );

        related = [
          ...related,
          ...fallbackSnap.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          ),
        ];
      } catch (error) {
        console.error(
          "Fallback related products failed:",
          error
        );
      }
    }

    /* -----------------------------------------------
       Remove duplicates
    ----------------------------------------------- */

    const unique = new Map();

    related.forEach((item) => {
      if (item?.id) {
        unique.set(
          String(item.id),
          item
        );
      }
    });

    /* -----------------------------------------------
       Remove current product
    ----------------------------------------------- */

    unique.delete(
      String(product.id)
    );

    /* -----------------------------------------------
       Sort by score
    ----------------------------------------------- */

    return Array.from(unique.values())
      .sort(
        (a, b) =>
          calcScore(b) -
          calcScore(a)
      )
      .slice(0, 12);
  } catch (error) {
    console.error(
      "Related products error:",
      error
    );

    return [];
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function ProductPage({
  product,
  relatedProducts = [],
}) {
  if (!product) {
    return null;
  }

  const title =
    getProductTitle(product);

  const rawDescription =
    safeText(
      product.description ??
      product["الوصف"]
    ) ||
    `Discover ${title} with detailed information and Amazon offers.`;

  const description =
    rawDescription.slice(
      0,
      5000
    );

  const seoDescription =
    rawDescription
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

  const image =
    getProductImage(product);

  const productSlug =
    safeText(product.slug) ||
    safeText(product.asin) ||
    safeText(product.id);

  const url =
    `${SITE_URL}/product/${encodeURIComponent(
      productSlug
    )}`;

  const price =
    getProductPrice(product);

  const currency =
    getProductCurrency(product);

  const brand =
    getProductBrand(product);

  const rating =
    getProductRating(product);

  const reviewCount =
    getProductReviewCount(product);

  const availability =
    getProductAvailability(product);

  const category =
    getProductCategory(product);

  const amazonLink =
    getProductLink(product);

  const score =
    calcScore(product);

  const level =
    getLevel(score);

  const seoTitle =
    `${title} – Price & Details | Koloonline`;

  /* =======================================================
     PRODUCT SCHEMA
  ======================================================= */

  const schema = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name: title,

    url,

    image: [image],

    description:
      seoDescription,

    ...(safeText(product.asin)
      ? {
          sku: safeText(
            product.asin
          ),
        }
      : {}),

    ...(brand
      ? {
          brand: {
            "@type": "Brand",
            name: brand,
          },
        }
      : {}),

    ...(price > 0
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency:
              currency,
            price: price.toFixed(
              2
            ),
            availability,
            itemCondition:
              "https://schema.org/NewCondition",
          },
        }
      : {}),

    ...(rating > 0 &&
    reviewCount > 0
      ? {
          aggregateRating: {
            "@type":
              "AggregateRating",
            ratingValue:
              rating.toFixed(1),
            reviewCount:
              reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <Head>
        <title>
          {seoTitle}
        </title>

        <meta
          name="description"
          content={
            seoDescription
          }
        />

        <meta
          name="robots"
          content={getRobots()}
        />

        <link
          rel="canonical"
          href={url}
        />

        <meta
          property="og:type"
          content="product"
        />

        <meta
          property="og:title"
          content={seoTitle}
        />

        <meta
          property="og:description"
          content={
            seoDescription
          }
        />

        <meta
          property="og:url"
          content={url}
        />

        <meta
          property="og:image"
          content={image}
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={seoTitle}
        />

        <meta
          name="twitter:description"
          content={
            seoDescription
          }
        />

        <meta
          name="twitter:image"
          content={image}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                schema
              ),
          }}
        />
      </Head>

      <main
        style={{
          maxWidth: 1000,
          margin:
            "0 auto",
          padding:
            "24px 20px 60px",
        }}
      >

        {/* BREADCRUMB */}

        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: 14,
            marginBottom: 20,
            color: "#666",
          }}
        >
          <Link href="/">
            Home
          </Link>

          {" / "}

          <Link href="/products">
            Products
          </Link>

          {" / "}

          <span>
            {title}
          </span>
        </nav>

        {/* PRODUCT */}

        <article>

          <h1
            style={{
              fontSize:
                "clamp(28px,5vw,42px)",
              lineHeight: 1.2,
              marginBottom:
                14,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              color: "#666",
              lineHeight: 1.8,
              maxWidth: 850,
            }}
          >
            {seoDescription}
          </p>

          {/* IMAGE */}

          <div
            style={{
              marginTop: 24,
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              border:
                "1px solid #eee",
            }}
          >
            <Image
              src={image}
              alt={title}
              width={900}
              height={650}
              priority
              quality={80}
              sizes="(max-width:768px)100vw,900px"
              style={{
                width: "100%",
                height: "auto",
                objectFit:
                  "contain",
              }}
            />
          </div>

          {/* DETAILS */}

          <section
            style={{
              marginTop: 32,
            }}
          >

            <h2>
              Product Details
            </h2>

            <p
              style={{
                lineHeight: 1.8,
                whiteSpace:
                  "pre-line",
              }}
            >
              {description}
            </p>

            {price > 0 && (
              <p>
                <strong>
                  Price:
                </strong>{" "}
                {currency}{" "}
                {price.toFixed(
                  2
                )}
              </p>
            )}

            {category && (
              <p>
                <strong>
                  Category:
                </strong>{" "}
                {category}
              </p>
            )}

            {/* SHOW RATING ONLY WHEN REAL */}

            {rating > 0 && (
              <p>
                <strong>
                  Rating:
                </strong>{" "}
                {rating.toFixed(
                  1
                )}
                /5

                {reviewCount >
                  0 && (
                  <>
                    {" "}
                    (
                    {
                      reviewCount
                    }{" "}
                    reviews)
                  </>
                )}
              </p>
            )}

            <p>
              <strong>
                AI Score:
              </strong>{" "}
              {score.toFixed(
                0
              )}
            </p>

            <p>
              <strong>
                Level:
              </strong>{" "}
              {level}
            </p>

            {/* AMAZON */}

            {amazonLink && (
              <a
                href={
                  amazonLink
                }
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                style={{
                  display:
                    "inline-block",
                  marginTop: 20,
                  padding:
                    "14px 26px",
                  background:
                    "#ff9900",
                  color:
                    "#fff",
                  borderRadius: 8,
                  textDecoration:
                    "none",
                  fontWeight: 700,
                }}
              >
                View on Amazon
              </a>
            )}
          </section>
        </article>

        {/* RELATED PRODUCTS */}

        {relatedProducts.length >
          0 && (
          <section
            style={{
              marginTop: 60,
            }}
          >
            <h2>
              🔥 More Products You May Like
            </h2>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: 18,
                marginTop: 20,
              }}
            >
              {relatedProducts.map(
                (item) => {
                  const itemTitle =
                    getProductTitle(
                      item
                    );

                  const itemSlug =
                    safeText(
                      item.slug
                    ) ||
                    safeText(
                      item.asin
                    ) ||
                    safeText(
                      item.id
                    );

                  const itemImage =
                    getProductImage(
                      item
                    );

                  return (
                    <Link
                      key={
                        item.id ||
                        itemSlug
                      }
                      href={`/product/${encodeURIComponent(
                        itemSlug
                      )}`}
                      style={{
                        textDecoration:
                          "none",
                        color:
                          "inherit",
                      }}
                    >
                      <article
                        style={{
                          border:
                            "1px solid #eee",
                          borderRadius:
                            12,
                          padding: 12,
                          background:
                            "#fff",
                          height:
                            "100%",
                        }}
                      >

                        <Image
                          src={
                            itemImage
                          }
                          alt={
                            itemTitle
                          }
                          width={
                            400
                          }
                          height={
                            300
                          }
                          loading="lazy"
                          sizes="(max-width:768px)50vw,220px"
                          style={{
                            width:
                              "100%",
                            height:
                              "auto",
                            objectFit:
                              "contain",
                            borderRadius:
                              8,
                          }}
                        />

                        <h3
                          style={{
                            fontSize:
                              17,
                            lineHeight:
                              1.4,
                            marginTop:
                              12,
                          }}
                        >
                          {
                            itemTitle
                          }
                        </h3>

                        {getProductPrice(
                          item
                        ) >
                          0 && (
                          <p
                            style={{
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              getProductCurrency(
                                item
                              )
                            }{" "}
                            {
                              getProductPrice(
                                item
                              ).toFixed(
                                2
                              )
                            }
                          </p>
                        )}

                        <p
                          style={{
                            color:
                              "#ff9900",
                            fontWeight:
                              700,
                          }}
                        >
                          AI Score:{" "}
                          {Math.round(
                            calcScore(
                              item
                            )
                          )}
                        </p>

                      </article>
                    </Link>
                  );
                }
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

/* =========================================================
   STATIC PROPS
========================================================= */

export async function getStaticProps({
  params,
}) {
  try {
    const id = String(
      params?.id || ""
    ).trim();

    if (!id) {
      return {
        notFound: true,
      };
    }

    const product =
      await findProduct(id);

    if (!product) {
      return {
        notFound: true,
        revalidate: 300,
      };
    }

    const relatedProducts =
      await getRelatedProducts(
        product
      );

    return {
      props: {
        product,
        relatedProducts,
      },

      revalidate: 300,
    };
  } catch (error) {
    console.error(
      "Product page error:",
      error
    );

    return {
      notFound: true,
      revalidate: 300,
    };
  }
}

/* =========================================================
   STATIC PATHS
========================================================= */

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
