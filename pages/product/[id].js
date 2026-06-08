import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE VALUE ================= */
function safe(val) {
  try {
    if (val === null || val === undefined) return "";

    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "boolean") return String(val);

    if (Array.isArray(val)) {
      return val.map((v) => safe(v)).join(" ");
    }

    if (typeof val === "object") {
      if (val?.toDate) {
        return val.toDate().toISOString();
      }

      if ("seconds" in val) {
        return "";
      }

      return JSON.stringify(val);
    }

    return String(val);
  } catch {
    return "";
  }
}

/* ================= SAFE IMAGE ================= */
function safeImage(img) {
  try {
    const optimized = optimizeAmazonImage(img);

    if (
      !optimized ||
      typeof optimized !== "string" ||
      optimized.trim() === ""
    ) {
      return fallbackImage;
    }

    return optimized;
  } catch {
    return fallbackImage;
  }
}

export default function ProductPage({
  product = null,
  related = [],
}) {
  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        Product not found
      </div>
    );
  }

  const productId = safe(product.id);
  const title = safe(product.title);
  const description = safe(product.description);
  const price = safe(product.price);

  const imageSrc = safeImage(product.image);

  const url = `https://koloonline.online/product/${productId}`;

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>

        <meta
          name="description"
          content={description || title}
        />

        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        <Image
          src={imageSrc}
          width={500}
          height={500}
          alt={title || "Product"}
          priority
          unoptimized={false}
        />

        {price && <h2>${price}</h2>}

        {description && <p>{description}</p>}

        <div style={{ marginTop: 20 }}>
          <Link href="/products">
            Back to Products
          </Link>
        </div>

        {Array.isArray(related) &&
          related.length > 0 && (
            <>
              <h2 style={{ marginTop: 30 }}>
                Related Products
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(180px,1fr))",
                  gap: 16,
                }}
              >
                {related.map((p) => {
                  const pid = safe(p?.id);

                  if (!pid) return null;

                  return (
                    <Link
                      key={pid}
                      href={`/product/${pid}`}
                    >
                      <div>
                        <Image
                          src={safeImage(p?.image)}
                          width={200}
                          height={200}
                          alt={safe(p?.title)}
                          loading="lazy"
                        />

                        <p>{safe(p?.title)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
      </div>
    </>
  );
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    if (!Array.isArray(products)) {
      return {
        notFound: true,
      };
    }

    const product =
      products.find(
        (p) => String(p?.id) === String(params?.id)
      ) || null;

    if (!product) {
      return {
        notFound: true,
      };
    }

    const related = products
      .filter(
        (p) =>
          String(p?.id) !== String(params?.id)
      )
      .slice(0, 4);

    return {
      props: {
        product: JSON.parse(
          JSON.stringify(product)
        ),
        related: JSON.parse(
          JSON.stringify(related)
        ),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error(
      "Product Page Error:",
      error
    );

    return {
      notFound: true,
      revalidate: 3600,
    };
  }
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    if (!Array.isArray(products)) {
      return {
        paths: [],
        fallback: "blocking",
      };
    }

    return {
      paths: products
        .filter((p) => p?.id)
        .slice(0, 50)
        .map((p) => ({
          params: {
            id: String(p.id),
          },
        })),
      fallback: "blocking",
    };
  } catch (error) {
    console.error(
      "getStaticPaths Error:",
      error
    );

    return {
      paths: [],
      fallback: "blocking",
    };
  }
      }
