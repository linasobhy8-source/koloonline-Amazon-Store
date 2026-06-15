import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/500x500?text=Product";

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);

  if (v?.toDate) {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  if (typeof v === "object") {
    if (v.title) return String(v.title);
    if (v.text) return String(v.text);
    if (v.value) return String(v.value);
  }

  return "";
};

const safeImage = (img) => {
  if (typeof img === "string") return img;
  if (img?.url) return img.url;
  if (img?.image) return img.image;
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
        <title>{product.title || "Product"}</title>
        <meta
          name="description"
          content={product.description || product.title || ""}
        />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{product.title}</h1>

        <Image
          src={product.image || fallbackImage}
          width={500}
          height={500}
          alt={product.title || "product"}
          priority
        />

        {product.price ? <h2>${product.price}</h2> : null}

        {product.description ? <p>{product.description}</p> : null}

        <Link href="/">← Home</Link>

        {/* RELATED */}
        {Array.isArray(related) && related.length > 0 && (
          <>
            <h3>Related</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 10,
              }}
            >
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div>
                    <Image
                      src={safeImage(p.image)}
                      width={200}
                      height={200}
                      alt={p.title || "product"}
                    />
                    <p>{p.title}</p>
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

/* ================= ISR ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const productRaw = (products || []).find(
      (p) => String(p?.id) === String(params?.id)
    );

    if (!productRaw) return { notFound: true };

    const product = {
      id: productRaw.id,
      title: safeText(productRaw.title),
      description: safeText(productRaw.description),
      image: safeImage(productRaw.image),
      price: safeText(productRaw.price),
    };

    const related = (products || [])
      .filter((p) => String(p?.id) !== String(params?.id))
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        title: safeText(p.title),
        image: safeImage(p.image),
      }));

    return {
      props: { product, related },
      revalidate: 3600,
    };
  } catch (e) {
    console.error("PRODUCT ERROR:", e);
    return { notFound: true };
  }
}

/* ================= PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    return {
      paths: (products || []).slice(0, 20).map((p) => ({
        params: { id: String(p.id) },
      })),
      fallback: "blocking",
    };
  } catch {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
          }
