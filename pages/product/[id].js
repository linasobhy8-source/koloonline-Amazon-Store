import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= SAFE ================= */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") return v?.title || v?.text || v?.name || "";
  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  if (typeof v === "object" && v) return v.url || v.image || "";
  return "https://via.placeholder.com/500x500?text=Koloonline";
};

/* ================= COMPONENT ================= */
export default function ProductPage({ product, related }) {
  if (!product) return <div>Not found</div>;

  const title = safeText(product.title);
  const description = safeText(product.description);
  const image = safeImage(product.image);
  const price = safeNumber(product.price);

  return (
    <>
      <Head>
        <title>{title}</title>
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

        {/* 🔥 SAFE RELATED (NO OBJECT RENDERING) */}
        {Array.isArray(related) &&
          related.map((p) => {
            const t = safeText(p?.title);
            const id = safeText(p?.id);

            return (
              <div key={id}>
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

    const clean = (products || [])
      .filter((p) => p && typeof p === "object")
      .map((p) => ({
        id: String(p.id || ""),
        title: safeText(p.title),
        description: safeText(p.description),
        image: safeImage(p.image),
        price: safeNumber(p.price),
      }))
      .filter((p) => p.id);

    const product = clean.find(
      (p) => p.id === String(params?.id)
    );

    if (!product) return { notFound: true };

    return {
      props: {
        product,
        related: clean.filter((p) => p.id !== product.id).slice(0, 6),
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
