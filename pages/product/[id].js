import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { optimizeAmazonImage } from "../../lib/amazonImage";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
  if (!product) {
    return (
      <div style={{ padding: 30 }}>
        <h1>❌ Product Not Found</h1>
        <Link href="/products">Back to Products</Link>
      </div>
    );
  }

  const url = `https://koloonline.online/product/${product.id}`;
  const imageSrc =
    optimizeAmazonImage(product.image) || fallbackImage;

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", padding: 20 }}>
      {/* ================= SEO ================= */}
      <Head>
        <title>{product.title} | Koloonline</title>

        <meta
          name="description"
          content={product.description || product.title}
        />

        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={product.title || ""} />
        <meta
          property="og:description"
          content={product.description || ""}
        />
        <meta property="og:image" content={imageSrc} />
        <meta property="og:url" content={url} />

        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* ================= PRODUCT ================= */}
      <div
        style={{
          maxWidth: 1000,
          margin: "auto",
          background: "#fff",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h1>{product.title}</h1>

        <Image
          src={imageSrc}
          alt={product.title || "product"}
          width={500}
          height={500}
          priority
          quality={80}
          placeholder="blur"
          blurDataURL={fallbackImage}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />

        <h2 style={{ color: "#B12704" }}>
          ${product.price || 0}
        </h2>

        <p>{product.description || ""}</p>

        <button
          onClick={() => {
            if (product.link) {
              window.open(product.link, "_blank");
            }
          }}
          style={{
            width: "100%",
            padding: 15,
            background: "#ff9900",
            border: 0,
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          🛒 Buy Now
        </button>
      </div>

      {/* ================= RELATED ================= */}
      {related?.length > 0 && (
        <div style={{ maxWidth: 1000, margin: "40px auto" }}>
          <h2>🔥 Related Products</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(200px,1fr))",
              gap: 15,
            }}
          >
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <div
                  style={{
                    background: "#fff",
                    padding: 10,
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={
                      optimizeAmazonImage(p.image) ||
                      fallbackImage
                    }
                    width={300}
                    height={300}
                    alt={p.title || "product"}
                    loading="lazy"
                    quality={75}
                    placeholder="blur"
                    blurDataURL={fallbackImage}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />

                  <h3>{p.title}</h3>
                  <p>${p.price || 0}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STATIC PATHS (OPTIMIZED) ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "products"));

  const paths = snap.docs.slice(0, 100).map((d) => ({
    params: { id: d.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

/* ================= STATIC PROPS (TURBO) ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast(); // 🔥 أهم تحسين

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
      notFound: true,
    };
  }
          }
