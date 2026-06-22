import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getProductsFast } from "../../lib/firebaseQuery";
import { normalizeProduct } from "../../lib/normalizeProduct";

/* ================= FORCE SAFE ================= */

const forceString = (v) => {
  const p = normalizeProduct({ title: v });
  return String(p.title || "");
};

const forceNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const forceImage = (v) => {
  const p = normalizeProduct({ image: v });

  const img = p.image;

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

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>
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
          unoptimized
        />

        {price > 0 && <h2>${price}</h2>}

        <p>{description}</p>

        <Link href="/">Home</Link>

        <hr />

        <h3>Related</h3>

        {Array.isArray(related) &&
          related.map((p) => {
            const t = forceString(p?.title);

            return (
              <div key={p?.id || t}>
                {t}
              </div>
            );
          })}
      </div>
    </>
  );
}

/* ================= DATA ================= */

export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const cleanProducts = (products || []).map(normalizeProduct);

    const product = cleanProducts.find(
      (p) => String(p.id) === String(params?.id)
    );

    if (!product) return { notFound: true };

    return {
      props: {
        product,
        related: cleanProducts.slice(0, 6),
      },
      revalidate: 3600,
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
}

/* ================= PATHS ================= */

export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    const clean = (products || []).map(normalizeProduct);

    return {
      paths: clean
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
