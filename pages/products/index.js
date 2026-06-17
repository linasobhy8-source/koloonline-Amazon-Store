import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { safeText, safeImage } from "../../lib/safe";

export default function Products({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Products | Koloonline</title>
      </Head>

      <h1>🔥 Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 20,
        }}
      >
        {products.map((p) => (
          <Link
            key={String(p?.id || Math.random())}
            href={`/product/${encodeURIComponent(String(p?.id || ""))}`}
          >
            <div>
              <Image
                src={safeImage(p?.image)}
                width={300}
                height={300}
                alt={safeText(p?.title)}
              />

              <h3>{safeText(p?.title)}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const products = await getProductsFast();

    const clean = Array.isArray(products)
      ? products.map((p) => ({
          id: String(p?.id || ""),
          title: safeText(p?.title),
          image: safeImage(p?.image),
        }))
      : [];

    return {
      props: {
        products: clean,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Products page error:", error);

    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
            }
