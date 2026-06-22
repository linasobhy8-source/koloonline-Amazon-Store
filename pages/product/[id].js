import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { safeText, safeImage, safeNumber } from "../../lib/normalizeProduct";

const safe = (v) => {
  try {
    if (typeof v === "string" || typeof v === "number") return String(v);
    if (v?.text) return String(v.text);
    if (v?.title) return String(v.title);
    if (v?.name) return String(v.name);
    return "";
  } catch {
    return "";
  }
};

export default function ProductPage({ product, related }) {
  if (!product || typeof product !== "object") {
    return <div style={{ padding: 20 }}>Not found</div>;
  }

  const title = safe(product.title);
  const description = safe(product.description);
  const image = safeImage(product.image);
  const price = Number(product.price || 0);

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>
        <meta name="description" content={description || ""} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        {/* 🔥 حماية كاملة */}
        {typeof image === "string" && image.startsWith("http") && (
          <Image
            src={image}
            width={500}
            height={500}
            alt={title}
            unoptimized
          />
        )}

        {price > 0 && <h2>${price}</h2>}

        <p>{description}</p>

        <Link href="/">Home</Link>

        <hr />

        {Array.isArray(related) &&
          related.map((p, i) => (
            <div key={p?.id || i}>
              {safe(p?.title)}
            </div>
          ))}
      </div>
    </>
  );
}

/* ================= DATA ================= */

export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const product = products.find(
      (p) => String(p?.id) === String(params?.id)
    );

    if (!product) return { notFound: true };

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)), // 🔥 مهم جدًا
        related: products.slice(0, 6),
      },
      revalidate: 3600,
    };
  } catch (e) {
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
  } catch {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
    }
