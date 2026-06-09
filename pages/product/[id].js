import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= SAFE (FINAL FIX) ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (v && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  return ""; // ❗ NEVER return object
};

/* ================= SAFE IMAGE ================= */
const fallbackImage = "https://via.placeholder.com/500x500";

const safeImage = (img) => {
  if (typeof img === "string" && img.startsWith("http")) return img;

  if (img && typeof img === "object") {
    if (typeof img.url === "string") return img.url;
    if (typeof img.image === "string") return img.image;
  }

  return fallbackImage;
};

export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const id = safeText(product.id);
  const title = safeText(product.title);
  const description = safeText(product.description);
  const price = safeText(product.price);

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

        {/* RELATED */}
        {Array.isArray(related) && related.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>Related</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {related.map((p) => {
                const pid = safeText(p?.id);
                const ptitle = safeText(p?.title);

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

    const product = products.find(
      (p) => String(p?.id) === String(params?.id)
    );

    if (!product) return { notFound: true };

    const related = products
      .filter((p) => String(p?.id) !== String(params?.id))
      .slice(0, 4);

    return {
      props: {
        product,
        related,
      },
      revalidate: 3600,
    };
  } catch {
    return { notFound: true };
  }
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    return {
      paths: products
        .filter((p) => p?.id)
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
