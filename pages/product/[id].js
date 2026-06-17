import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { safeText, safeImage } from "../../lib/safe";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function ProductPage({ product, related }) {
  if (!product?.id) {
    return <div>Product not found</div>;
  }

  const url = `https://koloonline.online/product/${product.id}`;

  return (
    <>
      <Head>
        <title>{safeText(product.title)}</title>
        <meta
          name="description"
          content={safeText(product.description)}
        />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{safeText(product.title)}</h1>

        <Image
          src={safeImage(product.image) || fallbackImage}
          width={500}
          height={500}
          alt={safeText(product.title)}
          priority
        />

        {product.price > 0 && (
          <h2>${product.price}</h2>
        )}

        <p>{safeText(product.description)}</p>

        <Link href="/">
          ← Home
        </Link>

        {related?.length > 0 && (
          <>
            <h3>Related Products</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: 15,
              }}
            >
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                >
                  <div>
                    <Image
                      src={
                        safeImage(p.image) ||
                        fallbackImage
                      }
                      width={200}
                      height={200}
                      alt={safeText(p.title)}
                    />

                    <p>{safeText(p.title)}</p>
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
    const products = await getProductsFast();

    const clean = (products || []).map((p) => ({
      id: String(p?.id || ""),
      title: safeText(
        typeof p?.title === "string"
          ? p.title
          : String(p?.title || "")
      ),
      description: safeText(
        typeof p?.description === "string"
          ? p.description
          : String(p?.description || "")
      ),
      image:
        typeof p?.image === "string" &&
        p.image.trim()
          ? p.image
          : fallbackImage,
      price: Number(p?.price || 0),
    }));

    const product = clean.find(
      (p) => p.id === String(params?.id || "")
    );

    if (!product) {
      return {
        notFound: true,
      };
    }

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
  } catch (error) {
    console.error(
      "Product page error:",
      error
    );

    return {
      notFound: true,
    };
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
          params: {
            id: String(p.id),
          },
        })),
      fallback: "blocking",
    };
  } catch (error) {
    console.error(
      "getStaticPaths error:",
      error
    );

    return {
      paths: [],
      fallback: "blocking",
    };
  }
            }
