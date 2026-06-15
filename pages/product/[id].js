import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

const fallbackImage = "https://via.placeholder.com/500x500";

const safe = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object") return JSON.stringify(v); // 🔥 يمنع crash نهائيًا
  return "";
};

const safeImage = (img) => {
  if (typeof img === "string") return img;
  if (img?.url) return img.url;
  if (img?.image) return img.image;
  return fallbackImage;
};

export default function ProductPage({ product, related }) {
  if (!product) return <div>Product not found</div>;

  const title = safe(product.title);
  const description = safe(product.description);
  const image = safeImage(product.image);
  const price = safe(product.price);

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <>
      <Head>
        <title>{title}</title>
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
          priority
        />

        {price ? <h2>${price}</h2> : null}

        <p>{description}</p>

        <Link href="/">← Home</Link>

        {related?.length > 0 && (
          <>
            <h3>Related</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div>
                    <Image
                      src={safeImage(p.image)}
                      width={200}
                      height={200}
                      alt={safe(p.title)}
                    />
                    <p>{safe(p.title)}</p>
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

/* ================= DATA ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast(); // ✅ المطلوب

    const clean = (products || []).map((p) => ({
      id: String(p?.id || ""),
      title: safe(p?.title),
      description: safe(p?.description),
      image: safeImage(p?.image),
      price: safe(p?.price),
    }));

    const product = clean.find((p) => p.id === String(params.id));

    if (!product) return { notFound: true };

    const related = clean
      .filter((p) => p.id !== product.id)
      .slice(0, 6);

    return {
      props: { product, related },
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
    const products = await getProductsFast(); // ✅

    const clean = (products || []).map((p) => ({
      id: String(p?.id || ""),
    }));

    return {
      paths: clean.slice(0, 20).map((p) => ({
        params: { id: p.id },
      })),
      fallback: "blocking",
    };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
                                          }
