import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { safeText, safeImage, safeNumber } from "../../lib/normalizeProduct";

/* ================= SAFE FORCE ================= */
const forceString = (v) => {
  const s = safeText(v);
  return typeof s === "string" ? s : "";
};

const forceNumber = (v) => {
  const n = safeNumber(v);
  return Number.isFinite(n) ? n : 0;
};

const forceImage = (v) => {
  const img = safeImage(v);
  return typeof img === "string" && img.startsWith("http")
    ? img
    : "https://via.placeholder.com/500x500?text=Koloonline";
};

/* ================= PAGE ================= */

export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Not found</div>;
  }

  const title = forceString(product.title);
  const description = forceString(product.description);
  const image = forceImage(product.image);
  const price = forceNumber(product.price);

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>
        <meta name="description" content={description} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        <Image
          src={image}
          width={500}
          height={500}
          alt={title}
          unoptimized
        />

        {price > 0 && <h2>${price}</h2>}

        <p>{description}</p>

        <Link href="/">Home</Link>

        <hr />

        {Array.isArray(related) &&
          related.map((p) => (
            <div key={p?.id || Math.random()}>
              {forceString(p?.title)}
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

    const product = (products || []).find(
      (p) => String(p?.id) === String(params?.id)
    );

    if (!product) return { notFound: true };

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        related: (products || []).slice(0, 6),
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
