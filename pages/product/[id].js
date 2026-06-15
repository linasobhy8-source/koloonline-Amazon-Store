import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= CONSTANTS ================= */
const fallbackImage =
  "https://via.placeholder.com/500x500?text=Product";

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (v?.toDate) {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  if (typeof v === "object") {
    if (typeof v.title === "string") return v.title;
    if (typeof v.text === "string") return v.text;
    if (typeof v.value === "string") return v.value;
  }

  return "";
};

const safeImage = (img) => {
  if (typeof img === "string" && img.trim()) return img;

  if (img && typeof img === "object") {
    if (typeof img.url === "string") return img.url;
    if (typeof img.image === "string") return img.image;
  }

  return fallbackImage;
};

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
  if (!product?.id) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <>
      <Head>
        <title>{safeText(product.title) || "Product"}</title>

        <meta
          name="description"
          content={
            safeText(product.description) ||
            safeText(product.title) ||
            ""
          }
        />

        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{safeText(product.title)}</h1>

        <Image
          src={safeImage(product.image)}
          width={500}
          height={500}
          alt={safeText(product.title) || "product"}
          priority
        />

        {safeText(product.price) && (
          <h2>${safeText(product.price)}</h2>
        )}

        {safeText(product.description) && (
          <p>{safeText(product.description)}</p>
        )}

        <Link href="/products">
          ← Back
        </Link>

        {related?.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>
              Related Products
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(180px,1fr))",
                gap: 12,
              }}
            >
              {related.map((p) => (
                <Link
                  key={String(p.id)}
                  href={`/product/${p.id}`}
                >
                  <div>
                    <Image
                      src={safeImage(p.image)}
                      width={200}
                      height={200}
                      alt={safeText(p.title) || "product"}
                      loading="lazy"
                    />

                    <p>{safeText(p.title)}</p>
                  </div>
                </Link>
              ))}
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
      return { notFound: true };
    }

    const productRaw = products.find(
      (p) => String(p?.id) === String(params?.id)
    );

    if (!productRaw) {
      return { notFound: true };
    }

    console.log(
      "BUILDING PRODUCT:",
      productRaw.id
    );

    const product = {
      id: String(productRaw.id || ""),
      title: safeText(productRaw.title),
      description: safeText(productRaw.description),
      image: safeImage(productRaw.image),
      price: safeText(productRaw.price),
    };

    const related = products
      .filter(
        (p) =>
          String(p?.id) !== String(params?.id)
      )
      .slice(0, 6)
      .map((p) => ({
        id: String(p.id || ""),
        title: safeText(p.title),
        image: safeImage(p.image),
      }));

    return {
      props: {
        product,
        related,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error(
      "PRODUCT PAGE BUILD ERROR:",
      error
    );

    return {
      notFound: true,
    };
  }
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    return {
      paths: (products || [])
        .filter((p) => p?.id)
        .slice(0, 30)
        .map((p) => ({
          params: {
            id: String(p.id),
          },
        })),
      fallback: "blocking",
    };
  } catch (error) {
    console.error(
      "STATIC PATHS ERROR:",
      error
    );

    return {
      paths: [],
      fallback: "blocking",
    };
  }
            }
