import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

/* ================= SAFE VALUE ================= */
function safe(val) {
  if (val === null || val === undefined) return "";

  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);

  if (typeof val === "object") {
    if (val?.toDate) return val.toDate().toISOString();
    if (Array.isArray(val)) return val.join(" ");
    return JSON.stringify(val);
  }

  return String(val);
}

/* ================= SAFE IMAGE ================= */
function safeImage(img) {
  const optimized = optimizeAmazonImage(img);

  if (!optimized || typeof optimized !== "string") {
    return fallbackImage;
  }

  return optimized;
}

export default function ProductPage({ product, related }) {
  if (!product) return <div>Not found</div>;

  const url = `https://koloonline.online/product/${product.id}`;

  const imageSrc = safeImage(product.image);

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>{safe(product.title)}</title>
        <meta name="description" content={safe(product.description)} />
        <link rel="canonical" href={url} />
      </Head>

      <h1>{safe(product.title)}</h1>

      <Image
        src={imageSrc}
        width={500}
        height={500}
        alt={safe(product.title)}
        priority
      />

      <h2>${safe(product.price)}</h2>

      <p>{safe(product.description)}</p>

      <Link href="/products">Back</Link>

      <h2>Related</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
        }}
      >
        {(related || []).map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
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
        ))}
      </div>
    </div>
  );
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const product =
      products.find((p) => p.id === params.id) || null;

    if (!product) {
      return { notFound: true };
    }

    const related = (products || [])
      .filter((p) => p.id !== params.id)
      .slice(0, 4);

    return {
      props: {
        product,
        related,
      },
      revalidate: 3600,
    };
  } catch (err) {
    console.error("Product page error:", err);

    return {
      props: {
        product: null,
        related: [],
      },
      revalidate: 3600,
    };
  }
}

/* ================= PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    return {
      paths: (products || []).slice(0, 50).map((p) => ({
        params: { id: String(p.id) },
      })),
      fallback: "blocking",
    };
  } catch (err) {
    console.error("getStaticPaths error:", err);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
          }
