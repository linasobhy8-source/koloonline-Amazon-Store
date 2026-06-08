import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

/* ================= HARD SAFE (NO OBJECTS ALLOWED) ================= */
const safe = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";

  // Firebase Timestamp
  if (v && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  // array → flatten safely
  if (Array.isArray(v)) {
    return v.map(safe).join(" ");
  }

  // ❌ any object = NEVER render it
  return "";
};

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  if (typeof img !== "string") return fallbackImage;

  const fixed = optimizeAmazonImage(img);

  if (typeof fixed !== "string" || !fixed.startsWith("http")) {
    return fallbackImage;
  }

  return fixed;
};

export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const id = safe(product.id);
  const title = safe(product.title);
  const description = safe(product.description);
  const price = safe(product.price);

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
          src={safeImage(product.image)}
          width={500}
          height={500}
          alt={title}
          priority
        />

        {price && <h2>${price}</h2>}

        {description && <p>{description}</p>}

        <Link href="/products">← Back</Link>

        {Array.isArray(related) && related.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>Related</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {related.map((p) => {
                const pid = safe(p?.id);
                const ptitle = safe(p?.title);

                if (!pid) return null;

                return (
                  <Link key={pid} href={`/product/${pid}`}>
                    <div>
                      <Image
                        src={safeImage(p?.image)}
                        width={200}
                        height={200}
                        alt={ptitle}
                        loading="lazy"
                      />
                      <p>{ptitle}</p>
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

    const product = products.find(
      (p) => String(p?.id) === String(params?.id)
    );

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
        .filter((p) => p?.id && typeof p.id === "string")
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
