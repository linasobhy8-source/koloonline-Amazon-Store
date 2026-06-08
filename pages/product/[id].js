import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

/* ================= SAFE TEXT ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    if (v?.toDate) return v.toDate().toISOString();
    return "";
  }

  return "";
};

/* ================= FIRESTORE DEEP CLEAN ================= */
const deepClean = (obj) => {
  if (obj === null || obj === undefined) return null;

  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(deepClean).filter(Boolean);
  }

  const cleaned = {};

  for (const key in obj) {
    const val = obj[key];

    if (val === undefined || val === null) continue;

    if (typeof val === "object") {
      if (val?.toDate) {
        cleaned[key] = val.toDate().toISOString();
      } else {
        cleaned[key] = "";
      }
    } else {
      cleaned[key] = val;
    }
  }

  return cleaned;
};

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  if (typeof img !== "string") return fallbackImage;

  const optimized = optimizeAmazonImage(img);

  if (!optimized || typeof optimized !== "string") {
    return fallbackImage;
  }

  return optimized;
};

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const id = safeText(product?.id);
  const title = safeText(product?.title);
  const description = safeText(product?.description);
  const price = safeText(product?.price);

  const url = `https://koloonline.online/product/${id}`;

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>
        <meta name="description" content={description || title} />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        <Image
          src={safeImage(product?.image)}
          width={500}
          height={500}
          alt={title || "Product"}
          priority
        />

        {price && <h2>${price}</h2>}

        {description && <p>{description}</p>}

        <Link href="/products">← Back</Link>

        {Array.isArray(related) && related.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>Related Products</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {related.map((p) => {
                const pid = safeText(p?.id);
                if (!pid) return null;

                return (
                  <Link key={pid} href={`/product/${pid}`}>
                    <div>
                      <Image
                        src={safeImage(p?.image)}
                        width={200}
                        height={200}
                        alt={safeText(p?.title)}
                        loading="lazy"
                      />
                      <p>{safeText(p?.title)}</p>
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
      return { notFound: true };
    }

    const productRaw =
      products.find((p) => String(p?.id) === String(params?.id)) || null;

    if (!productRaw) {
      return { notFound: true };
    }

    const product = deepClean(productRaw);

    const related = products
      .filter((p) => String(p?.id) !== String(params?.id))
      .slice(0, 4)
      .map(deepClean);

    return {
      props: {
        product,
        related,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Product page error:", error);
    return { notFound: true };
  }
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    if (!Array.isArray(products)) {
      return { paths: [], fallback: "blocking" };
    }

    return {
      paths: products
        .filter((p) => p?.id)
        .slice(0, 50)
        .map((p) => ({
          params: { id: String(p.id) },
        })),
      fallback: "blocking",
    };
  } catch (error) {
    console.error("getStaticPaths error:", error);
    return { paths: [], fallback: "blocking" };
  }
}
