import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= SAFE ================= */
const safe = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safe).join(" ");

  if (typeof v === "object") {
    return v?.text || v?.title || v?.name || v?.value || "";
  }

  return "";
};

const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/500x500?text=Koloonline";

  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object" && v !== null) {
    const img = v.url || v.image || v.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return fallback;
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
  if (!product) return <div style={{ padding: 20 }}>Not found</div>;

  const title = safe(product.title);
  const description = safe(product.description);
  const image = safeImage(product.image);
  const price = safeNumber(product.price);

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

        <h3>Related</h3>

        {Array.isArray(related) &&
          related.map((p) => (
            <div key={p?.id}>
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
        product: JSON.parse(JSON.stringify(product)),
        related: products.slice(0, 6),
      },
      revalidate: 3600,
    };
  } catch {
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
