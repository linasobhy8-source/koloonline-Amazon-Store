import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

/* ================= SAFE TEXT ================= */
const safe = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    return v.map((x) => safe(x)).join(" ");
  }

  if (typeof v === "object") {
    if (v?.toDate) return v.toDate().toISOString();
    return ""; // ❗ مهم: ممنوع JSON.stringify (بيكسر React)
  }

  return "";
};

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  try {
    if (typeof img !== "string") return fallbackImage;

    const optimized = optimizeAmazonImage(img);

    if (!optimized || typeof optimized !== "string") {
      return fallbackImage;
    }

    return optimized;
  } catch {
    return fallbackImage;
  }
};

export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const productId = safe(product.id);
  const title = safe(product.title);
  const description = safe(product.description);
  const price = safe(product.price);

  const url = `https://koloonline.online/product/${productId}`;

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
          src={safeImage(product.image)}
          width={500}
          height={500}
          alt={title || "Product"}
          priority
        />

        {price && <h2>${price}</h2>}

        {description && <p>{description}</p>}

        <Link href="/products">Back</Link>

        <h2 style={{ marginTop: 30 }}>Related</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {(related || []).map((p) => {
            const pid = safe(p?.id);
            if (!pid) return null;

            return (
              <Link key={pid} href={`/product/${pid}`}>
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

    const product =
      products.find((p) => String(p?.id) === String(params?.id)) ||
      null;

    if (!product) {
      return { notFound: true };
    }

    const related = products
      .filter((p) => String(p?.id) !== String(params?.id))
      .slice(0, 4);

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        related: JSON.parse(JSON.stringify(related)),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Product page error:", error);

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

    return {
      paths: [],
      fallback: "blocking",
    };
  }
                         }
