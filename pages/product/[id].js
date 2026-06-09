import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/500x500?text=Product";

/* ================= FAST SAFE HELPERS ================= */
const safeText = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v?.text) return v.text;
  if (v?.title) return v.title;
  return "";
};

const safeImage = (img) => {
  if (typeof img === "string" && img.startsWith("http")) return img;
  if (img?.url) return img.url;
  if (img?.image) return img.image;
  return fallbackImage;
};

/* ================= PRE-NORMALIZE (IMPORTANT OPTIMIZATION) ================= */
const normalize = (p) => ({
  id: String(p?.id || ""),
  title: safeText(p?.title),
  description: safeText(p?.description),
  image: safeImage(p?.image),
  price: safeText(p?.price),
});

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
  if (!product?.id) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <>
      {/* SEO */}
      <Head>
        <title>{product.title || "Product"}</title>
        <meta
          name="description"
          content={product.description || product.title || ""}
        />
        <link rel="canonical" href={url} />
      </Head>

      {/* PRODUCT */}
      <div style={{ padding: 20 }}>
        <h1>{product.title}</h1>

        <Image
          src={product.image}
          width={500}
          height={500}
          alt={product.title}
          priority
        />

        {product.price && <h2>${product.price}</h2>}
        {product.description && <p>{product.description}</p>}

        <Link href="/products">← Back</Link>

        {/* RELATED */}
        {related?.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>Related</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div>
                    <Image
                      src={p.image}
                      width={200}
                      height={200}
                      alt={p.title}
                      loading="lazy"
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

/* ================= OPTIMIZED STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    if (!Array.isArray(products) || products.length === 0) {
      return { notFound: true };
    }

    // 🔥 بدل find على raw data → نستخدم pre-normalized map مرة واحدة
    const normalized = products.map(normalize);

    const product = normalized.find((p) => p.id === String(params?.id));

    if (!product) return { notFound: true };

    // 🔥 related بدون إعادة normalize (أسرع)
    const related = normalized
      .filter((p) => p.id !== product.id)
      .slice(0, 6);

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

/* ================= ULTRA FAST PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    if (!Array.isArray(products)) {
      return { paths: [], fallback: "blocking" };
    }

    // 🔥 أهم تحسين: نقلل البيانات قبل map
    const paths = products.slice(0, 50).map((p) => ({
      params: { id: String(p.id) },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
         }
