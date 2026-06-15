import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { normalizeProduct } from "../../lib/normalizeProduct";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Product";

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  if (typeof img === "string") return img;
  if (img?.url) return img.url;
  if (img?.image) return img.image;
  if (img?.src) return img.src;
  return fallbackImage;
};

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
  if (!product?.id) return <div>Product not found</div>;

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <>
      <Head>
        <title>{product.title || "Product"}</title>
        <meta name="description" content={product.description || ""} />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{String(product.title || "")}</h1>

        <Image
          src={safeImage(product.image)}
          width={500}
          height={500}
          alt={String(product.title || "product")}
          priority
        />

        {product.price ? <h2>${product.price}</h2> : null}

        <p>{String(product.description || "")}</p>

        <Link href="/">← Home</Link>

        {related?.length > 0 && (
          <>
            <h3>Related</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
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
                      alt={String(p.title || "")}
                    />
                    <p>{String(p.title || "")}</p>
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

/* ================= DATA FETCH ================= */
export async function getStaticProps({ params }) {
  try {
    // ⚠️ لازم استخدام موحد زي ما طلبت
    const products = await getProductsFast();

    const clean = (Array.isArray(products) ? products : [])
      .map(normalizeProduct);

    const product = clean.find(
      (p) => String(p.id) === String(params.id)
    );

    if (!product?.id) return { notFound: true };

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
    console.error("PRODUCT ERROR:", e);
    return { notFound: true };
  }
}

/* ================= PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    const clean = (Array.isArray(products) ? products : [])
      .map(normalizeProduct);

    return {
      paths: clean.slice(0, 20).map((p) => ({
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
