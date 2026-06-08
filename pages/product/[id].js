import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

/* ================= HARD SAFE ================= */
const safe = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);

  // 🚨 أهم نقطة: أي object يتحول لفاضي (ممنوع يظهر)
  if (typeof v === "object") return "";

  return "";
};

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  if (typeof img !== "string") return fallbackImage;

  const optimized = optimizeAmazonImage(img);
  return typeof optimized === "string" && optimized.length > 5
    ? optimized
    : fallbackImage;
};

export default function ProductPage({ product, related }) {
  if (!product || typeof product !== "object") {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const id = safe(product.id);
  const title = safe(product.title);
  const description = safe(product.description);
  const price = safe(product.price);

  const url = `https://koloonline.online/product/${id || ""}`;

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>
        <meta name="description" content={description || title} />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title || "Untitled Product"}</h1>

        <Image
          src={safeImage(product.image)}
          width={500}
          height={500}
          alt={title || "product"}
          priority
        />

        {price ? <h2>${price}</h2> : null}

        {description ? <p>{description}</p> : null}

        <Link href="/products">← Back</Link>

        {Array.isArray(related) && related.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>Related</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {related.map((p) => {
                if (!p || typeof p !== "object") return null;

                const pid = safe(p.id);
                if (!pid) return null;

                return (
                  <Link key={pid} href={`/product/${pid}`}>
                    <div>
                      <Image
                        src={safeImage(p.image)}
                        width={200}
                        height={200}
                        alt={safe(p.title)}
                        loading="lazy"
                      />
                      <p>{safe(p.title)}</p>
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

    if (!Array.isArray(products)) return { notFound: true };

    const product = products.find(
      (p) => p && String(p.id) === String(params?.id)
    );

    if (!product || typeof product !== "object") {
      return { notFound: true };
    }

    const related = products
      .filter((p) => p && String(p.id) !== String(params?.id))
      .slice(0, 4);

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        related: JSON.parse(JSON.stringify(related)),
      },
      revalidate: 3600,
    };
  } catch (e) {
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
        .filter((p) => p && p.id)
        .slice(0, 50)
        .map((p) => ({
          params: { id: String(p.id) },
        })),
      fallback: "blocking",
    };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
}
