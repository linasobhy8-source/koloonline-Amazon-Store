import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

/* ================= SAFE ================= */
const safe = (v) => {
  if (typeof v === "string" || typeof v === "number") return v;
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

const safeImage = (img) => {
  if (typeof img !== "string") return fallbackImage;
  return optimizeAmazonImage(img) || fallbackImage;
};

export default function ProductPage({ product, related }) {
  if (!product) return <div>Not found</div>;

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>{safe(product.title)}</title>
        <meta name="description" content={safe(product.description)} />
        <link rel="canonical" href={url} />
      </Head>

      <h1>{safe(product.title)}</h1>

      <Image
        src={safeImage(product.image)}
        width={500}
        height={500}
        alt={safe(product.title)}
        priority
      />

      <h2>${safe(product.price)}</h2>

      <p>{safe(product.description)}</p>

      <Link href="/products">Back</Link>

      <h2>Related</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
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

export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const product = products.find((p) => p.id === params.id);

    if (!product) {
      return { notFound: true };
    }

    const related = products
      .filter((p) => p.id !== params.id)
      .slice(0, 4);

    return {
      props: {
        product,
        related,
      },
      revalidate: 3600,
    };
  } catch (e) {
    return {
      props: {
        product: null,
        related: [],
      },
    };
  }
}

export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    return {
      paths: products.slice(0, 50).map((p) => ({
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
