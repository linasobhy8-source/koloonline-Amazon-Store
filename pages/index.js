import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { safeText, safeNumber, safeImage } from "../lib/safeProduct";

export default function Home({ products = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <>
      <Head>
        <title>Koloonline | Trending Amazon Products</title>
        <meta name="description" content="Best Amazon deals & trending products" />
        <meta name="robots" content="index,follow" />
      </Head>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
        <h1>🔥 Trending Products</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20
        }}>
          {safeProducts.map((p) => {
            if (!p?.id) return null;

            const id = safeText(p.id);
            const title = safeText(p.title);
            const price = safeNumber(p.price);
            const image = safeImage(p.image);

            return (
              <Link key={id} href={`/product/${id}`}>
                <div style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 10
                }}>
                  <Image
                    src={image}
                    width={220}
                    height={220}
                    alt={title || "product"}
                  />

                  <h3>{title || "Untitled"}</h3>
                  <p>${price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

/* ================= SSR SAFE ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import("../lib/firebaseQuery");
    const products = await getProductsFast();

    return {
      props: { products: JSON.parse(JSON.stringify(products)) },
      revalidate: 300
    };
  } catch (e) {
    return {
      props: { products: [] },
      revalidate: 300
    };
  }
    }
