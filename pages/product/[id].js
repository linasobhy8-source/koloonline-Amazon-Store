import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getProductsFast } from "../../lib/firebaseQuery";
import {
  safeText,
  safeImage,
  safeNumber,
} from "../../lib/safe";

/* ================= FALLBACK ================= */
const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= PAGE ================= */

export default function ProductPage({ product, related }) {
  if (!product) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  // 🔥 HARD SAFE FINAL
  const title = String(safeText(product?.title) || "");
  const description = String(safeText(product?.description) || "");
  const imageRaw = safeImage(product?.image);
  const image =
    typeof imageRaw === "string" && imageRaw.startsWith("http")
      ? imageRaw
      : FALLBACK_IMAGE;

  const price = Number(safeNumber(product?.price) || 0);

  const url = `https://koloonline.online/product/${product?.id || ""}`;

  return (
    <>
      <Head>
        <title>{title || "Product"}</title>
        <meta name="description" content={description || ""} />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        {/* 🔥 SAFE IMAGE (NO OBJECT EVER) */}
        <Image
          src={image}
          width={500}
          height={500}
          alt={title || "Product"}
          priority
        />

        {price > 0 && <h2>${price}</h2>}

        <p>{description}</p>

        <Link href="/">← Home</Link>

        {Array.isArray(related) && related.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Related Products</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: 15,
              }}
            >
              {related.map((p) => {
                const rTitle = String(safeText(p?.title) || "");
                const rImageRaw = safeImage(p?.image);

                const rImage =
                  typeof rImageRaw === "string" &&
                  rImageRaw.startsWith("http")
                    ? rImageRaw
                    : FALLBACK_IMAGE;

                return (
                  <Link
                    key={String(p?.id || rTitle)}
                    href={`/product/${p?.id}`}
                  >
                    <div style={{ cursor: "pointer" }}>
                      <Image
                        src={rImage}
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

    const clean = (products || []).map((p) => ({
      id: String(p?.id || ""),
      title: String(safeText(p?.title) || ""),
      description: String(safeText(p?.description) || ""),
      image: String(safeImage(p?.image) || ""),
      price: Number(safeNumber(p?.price) || 0),
    }));

    const product = clean.find(
      (p) => p.id === String(params?.id || "")
    );

    if (!product) {
      return { notFound: true };
    }

    return {
      props: {
        product,
        related: clean
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
          params: {
            id: String(p.id),
          },
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
