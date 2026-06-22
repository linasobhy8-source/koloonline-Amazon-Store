import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getProductsFast } from "../../lib/firebaseQuery";
import { safeText, safeImage, safeNumber } from "../../lib/safe";

export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Not found</div>;
  }

  // 🔥 SAFE CONVERSIONS (prevent React #130)
  const title = safeText(product.title);
  const description = safeText(product.description);
  const image = safeImage(product.image);
  const price = safeNumber(product.price);

  const url = `https://koloonline.online/product/${product.id || ""}`;

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>
        <meta name="description" content={description || ""} />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        <Image
          src={
            typeof image === "string" && image.startsWith("http")
              ? image
              : "https://via.placeholder.com/500x500?text=Koloonline"
          }
          width={500}
          height={500}
          alt={title || "Product"}
          priority
        />

        {price > 0 && <h2>${price}</h2>}

        <p>{description}</p>

        <Link href="/">← Home</Link>

        {/* ================= RELATED ================= */}
        {Array.isArray(related) && related.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Related Products</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 15,
              }}
            >
              {related.map((p) => {
                const rTitle = safeText(p.title);
                const rImage = safeImage(p.image);

                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                  >
                    <div style={{ cursor: "pointer" }}>
                      <Image
                        src={
                          typeof rImage === "string" &&
                          rImage.startsWith("http")
                            ? rImage
                            : "https://via.placeholder.com/300"
                        }
                        width={200}
                        height={200}
                        alt={rTitle || "Product"}
                      />
                      <p>{rTitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= DATA ================= */

export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const product = products.find(
      (p) => String(p.id) === String(params.id)
    );

    if (!product) {
      return { notFound: true };
    }

    return {
      props: {
        product,
        related: products
          .filter((p) => p.id !== product.id)
          .slice(0, 6),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Product error:", error);
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
  } catch (error) {
    console.error("Paths error:", error);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
          }
