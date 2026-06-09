import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { safeProduct, safeProducts } from "../../lib/safe";

export default function ProductPage({ product, related }) {
  // 🔥 IMPORTANT: normalize once
  const p = safeProduct(product);

  if (!p) {
    return <div style={{ padding: 20 }}>Product not found</div>;
  }

  const url = `https://koloonline.online/product/${p.id}`;

  return (
    <>
      <Head>
        <title>{p.title || "Product"}</title>
        <meta name="description" content={p.description || p.title} />
        <link rel="canonical" href={url} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{p.title}</h1>

        <Image
          src={p.image}
          width={500}
          height={500}
          alt={p.title || "Product"}
          priority
        />

        {p.price && <h2>${p.price}</h2>}

        {p.description && <p>{p.description}</p>}

        <Link href="/products">← Back</Link>

        {/* ================= RELATED ================= */}
        {Array.isArray(related) && related.length > 0 && (
          <>
            <h2 style={{ marginTop: 30 }}>Related</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {safeProducts(related).map((item) => {
                if (!item?.id) return null;

                return (
                  <Link key={item.id} href={`/product/${item.id}`}>
                    <div>
                      <Image
                        src={item.image}
                        width={200}
                        height={200}
                        alt={item.title || "Product"}
                        loading="lazy"
                      />
                      <p>{item.title}</p>
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

    const product = products.find(
      (p) => String(p?.id) === String(params?.id)
    );

    if (!product) {
      return { notFound: true };
    }

    const related = products
      .filter((p) => String(p?.id) !== String(params?.id))
      .slice(0, 4);

    return {
      props: {
        product, // ❗ raw data (safeProduct inside component)
        related,
      },
      revalidate: 3600,
    };
  } catch (e) {
    return { notFound: true };
  }
}

/* ================= STATIC PATHS ================= */
export async function getStaticPaths() {
  try {
    const products = await getProductsFast();

    return {
      paths: products.map((p) => ({
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
