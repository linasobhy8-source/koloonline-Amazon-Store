import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const FALLBACK =
  "https://via.placeholder.com/300?text=Koloonline";

/* ================= FINAL SAFE ================= */
const safe = (v) => {
  if (v == null) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safe).join(" ");
  }

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

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const img = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  return FALLBACK;
};

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  const safeProducts = Array.isArray(products)
    ? products
        .filter(Boolean)
        .map((p) => ({
          id: safe(p?.id),
          title: safe(p?.title),
          image: img(p?.image),
          price: num(p?.price),
        }))
        .filter((p) => p.id)
    : [];

  return (
    <>
      <Head>
        <title>Koloonline | Trending Amazon Products</title>
        <meta
          name="description"
          content="Discover trending Amazon products"
        />
        <meta name="robots" content="index,follow" />
        <link
          rel="canonical"
          href="https://koloonline.online/"
        />
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
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {safeProducts.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              style={{
                display: "block",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 10,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Image
                src={p.image}
                alt={p.title || "product"}
                width={220}
                height={220}
                priority={i < 4}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 8,
                }}
              />

              <h3>{p.title || "Untitled"}</h3>

              <p style={{ fontWeight: "bold" }}>
                ${p.price}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import(
      "../lib/firebaseQuery"
    );

    const raw = await getProductsFast();

    const products = Array.isArray(raw)
      ? raw.map((p) => ({
          id: String(p?.id || ""),
          title: String(p?.title || ""),
          image: String(p?.image || ""),
          price: Number(p?.price || 0),
        }))
      : [];

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (e) {
    console.error(e);
    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
        }
