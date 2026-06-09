import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= FALLBACK ================= */
const fallbackImage = "https://via.placeholder.com/500x500?text=Product";

/* ================= SAFE TEXT ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (v?.toDate && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    return v?.text || v?.title || v?.value || "";
  }

  return "";
};

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  if (typeof img === "string" && img.startsWith("http")) {
    return img;
  }

  if (img && typeof img === "object") {
    return img?.url || img?.image || fallbackImage;
  }

  return fallbackImage;
};

/* ================= NORMALIZE PRODUCT ================= */
const normalizeProduct = (p) => {
  if (!p || typeof p !== "object") return null;

  return {
    id: safeText(p.id),
    title: safeText(p.title),
    description: safeText(p.description),
    image: safeImage(p.image),
    price: safeText(p.price),
  };
};

export default function ProductPage({ product, related }) {
  const p = normalizeProduct(product);

  if (!p?.id) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const url = `https://koloonline.online/product/${p.id}`;

  return (
    <>
      {/* ================= SEO ================= */}
      <Head>
        <title>{p.title || "Product"}</title>
        <meta name="description" content={p.description || p.title} />
        <link rel="canonical" href={url} />
      </Head>

      {/* ================= PRODUCT ================= */}
      <div style={{ padding: 20 }}>
        <h1>{p.title || "Untitled Product"}</h1>

        <Image
          src={p.image || fallbackImage}
          width={500}
          height={500}
          alt={p.title || "product"}
          priority
        />

        {p.price && <h2>${p.price}</h2>}

        {p.description && <p>{p.description}</p>}

        <Link href="/products">← Back</Link>

        {/* ================= RELATED ================= */}
        {Array.isArray(related) && related.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>Related Products</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {related.map((item) => {
                const rp = normalizeProduct(item);
                if (!rp?.id) return null;

                return (
                  <Link key={rp.id} href={`/product/${rp.id}`}>
                    <div>
                      <Image
                        src={rp.image || fallbackImage}
                        width={200}
                        height={200}
                        alt={rp.title || "product"}
                        loading="lazy"
                      />
                      <p>{rp.title || "No title"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  try {
    const products = await getProductsFast();

    const productRaw = products.find(
      (p) => String(p?.id) === String(params?.id)
    );

    if (!productRaw) return { notFound: true };

    const product = normalizeProduct(productRaw);

    const related = products
      .filter((p) => String(p?.id) !== String(params?.id))
      .slice(0, 4)
      .map(normalizeProduct)
      .filter(Boolean);

    return {
      props: {
        product,
        related,
      },
      revalidate: 3600,
    };
  } catch (e) {
    console.error("getStaticProps error:", e);
    return { notFound: true };
  }
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    const paths = products
      .filter((p) => p?.id)
      .slice(0, 50)
      .map((p) => ({
        params: { id: String(p.id) },
      }));

    console.log("🔥 STATIC PATHS:", paths.length);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (e) {
    console.error("STATIC PATHS ERROR:", e);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
