import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

const fallbackImage = "https://via.placeholder.com/500x500?text=Product";

/* ================= SAFE UTILS (OPTIMIZED) ================= */
const safeText = (v) => {
  if (!v) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.join(" ");

  if (v?.text) return v.text;
  if (v?.title) return v.title;
  if (v?.value) return v.value;

  return "";
};

const safeImage = (img) => {
  if (typeof img === "string" && img.startsWith("http")) return img;
  if (img?.url) return img.url;
  if (img?.image) return img.image;
  return fallbackImage;
};

/* ================= SERVER SIDE (FAST RENDER) ================= */
export async function getStaticProps() {
  try {
    const products = await getProductsFast();

    // 🔥 أهم تحسين: نعمل trim على السيرفر قبل ما نبعته للعميل
    const optimized = (products || [])
      .slice(0, 40)
      .map((p) => ({
        id: safeText(p?.id),
        title: safeText(p?.title),
        image: safeImage(p?.image),
      }))
      .filter((p) => p.id);

    return {
      props: {
        products: optimized,
      },
      revalidate: 300, // كل 5 دقائق فقط
    };
  } catch {
    return {
      props: {
        products: [],
      },
      revalidate: 300,
    };
  }
}

/* ================= PAGE ================= */
export default function ProductsPage({ products }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Products | Koloonline</title>
        <meta name="description" content="Trending products and deals" />
      </Head>

      <h1>🔥 Trending Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: 10,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Image
                src={p.image}
                width={300}
                height={300}
                alt={p.title}
                loading="lazy"
                style={{ objectFit: "contain" }}
              />

              <h3 style={{ fontSize: 14 }}>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
