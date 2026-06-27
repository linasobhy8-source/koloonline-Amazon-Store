import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

/* ================= SAFE CORE ================= */
const toText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(toText).join(" ");

  if (typeof v === "object") {
    return (
      v?.title ||
      v?.name ||
      v?.text ||
      v?.value ||
      ""
    );
  }

  return "";
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object" && v !== null) {
    const img = v.url || v.image || v.src || "";
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return "https://via.placeholder.com/300?text=Koloonline";
};

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <>
      <Head>
        <title>Koloonline | Trending Amazon Products</title>
        <meta
          name="description"
          content="Discover trending Amazon products, smart gadgets and best deals."
        />
        <meta name="robots" content="index,follow" />
      </Head>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
        <h1>🔥 Trending Products</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {safeProducts.map((p, i) => {
            const id = toText(p?.id);
            const title = toText(p?.title);
            const image = toImage(p?.image);
            const price = toNumber(p?.price);

            if (!id) return null;

            return (
              <Link
                key={id}
                href={`/product/${id}`}
                style={{
                  display: "block",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "#000",
                }}
              >
                <Image
                  src={image}
                  alt={title || "product"}
                  width={300}
                  height={300}
                  priority={i < 3}
                />

                <h3>
                  {title || "Untitled Product"}
                </h3>

                <p>${price}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import("../lib/firebaseQuery");

    const raw = await getProductsFast();

    const products = Array.isArray(raw)
      ? raw
          .filter((x) => x && typeof x === "object")
          .map((p) => ({
            id: toText(p?.id),
            title: toText(p?.title),
            image: toImage(p?.image),
            price: toNumber(p?.price),
          }))
          .filter((p) => p.id)
      : [];

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (e) {
    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
    }
