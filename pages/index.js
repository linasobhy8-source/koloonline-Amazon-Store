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

        <meta
          name="description"
          content="Best Amazon deals & trending products"
        />

        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://koloonline.online/" />
      </Head>

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: 20,
        }}
      >
        <h1>🔥 Trending Products</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {safeProducts.map((p, index) => {
            // 🔥 HARD GUARD (منع أي object crash)
            if (!p || typeof p !== "object") return null;

            const id = safeText(p.id);
            const title = safeText(p.title);
            const price = safeNumber(p.price);
            const image = safeImage(p.image);

            if (!id) return null;

            return (
              <Link key={id} href={`/product/${id}`}>
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 10,
                    background: "#fff",
                  }}
                >
                  <Image
                    src={image}
                    width={220}
                    height={220}
                    alt={typeof title === "string" ? title : "product"}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />

                  <h3>
                    {typeof title === "string" && title.length > 0
                      ? title
                      : "Untitled Product"}
                  </h3>

                  <p style={{ fontWeight: "bold" }}>
                    ${typeof price === "number" ? price : 0}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

/* ================= SSR SAFE (FINAL FIX) ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import("../lib/firebaseQuery");

    const raw = await getProductsFast();

    // 🔥 أهم سطر في المشروع كله (kills React #130 forever)
    const products = JSON.parse(JSON.stringify(raw || []));

    return {
      props: {
        products: Array.isArray(products) ? products : [],
      },
      revalidate: 300,
    };
  } catch (e) {
    console.error("Home build error:", e);

    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
            }
