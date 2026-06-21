import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= SAFE HELPERS ================= */
const safeString = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") {
    return v.text || v.title || v.value || v.name || "";
  }
  return "";
};

const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/500x500?text=Koloonline";

  if (typeof v === "string" && v.trim()) return v;

  if (typeof v === "object") {
    return v.url || v.image || v.src || fallback;
  }

  return fallback;
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const title = safeString(product.title);
  const description = safeString(product.description);
  const image = safeImage(product.image);
  const price = safeNumber(product.price);

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        <Image
          src={image}
          width={500}
          height={500}
          alt={title}
          priority
        />

        {price > 0 && <h2>${price}</h2>}

        <p>{description}</p>

        <Link href="/">← Home</Link>

        {Array.isArray(related) && related.length > 0 && (
          <>
            <h3>Related Products</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: 15,
              }}
            >
              {related.map((p) => {
                const rTitle = safeString(p.title);
                const rImage = safeImage(p.image);

                return (
                  <Link key={p.id} href={`/product/${p.id}`}>
                    <div style={{ cursor: "pointer" }}>
                      <Image
                        src={rImage}
                        width={200}
                        height={200}
                        alt={rTitle}
                      />
                      <p>{rTitle}</p>
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

/* ================= DATA ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const clean = (products || []).map((p) => ({
      id: String(p?.id || ""),
      title: safeString(p?.title),
      description: safeString(p?.description),
      image: safeImage(p?.image),
      price: safeNumber(p?.price),
    }));

    const product = clean.find(
      (p) => p.id === String(params?.id || "")
    );

    if (!product) {
      return { notFound: true };
    }

    const related = clean
      .filter((p) => p.id !== product.id)
      .slice(0, 6);

    return {
      props: {
        product,
        related,
      },
      revalidate: 3600,
    };
  } catch (e) {
    console.error("Product error:", e);
    return { notFound: true };
  }
}

/* ================= PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    return {
      paths: (products || [])
        .filter((p) => p?.id)
        .slice(0, 20)
        .map((p) => ({
          params: { id: String(p.id) },
        })),
      fallback: "blocking",
    };
  } catch (e) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
            }
