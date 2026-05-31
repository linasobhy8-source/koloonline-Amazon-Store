import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/600x600?text=Koloonline";

/* ================= AI REVENUE ENGINE ================= */
function useRevenueEngine(product, allProducts = []) {
  return useMemo(() => {
    if (!product) return null;

    const price = Number(product.price || 0);

    const upsells = allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          Number(p.price || 0) > price &&
          p.category === product.category
      )
      .slice(0, 3);

    const cheaperAlternatives = allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          Number(p.price || 0) < price
      )
      .slice(0, 3);

    return {
      upsells,
      cheaperAlternatives,
      urgency:
        product.viralBoost || product.clicks > 50
          ? "🔥 Trending - Price may increase soon"
          : "⚡ Limited time deal",
    };
  }, [product, allProducts]);
}

/* ================= ADS ================= */
function AdBox() {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", margin: "12px 0" }}
      data-ad-client="ca-pub-1294940976431468"
      data-ad-slot="auto"
    />
  );
}

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);
  return (
    <div>
      {"⭐".repeat(full)} {rating}/5
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProductPage({ product, allProducts }) {
  const engine = useRevenueEngine(product, allProducts);

  if (!product) return <div>Not Found</div>;

  const price = Number(product.price || 0);

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>
      <Head>
        <title>{product.title} | Koloonline</title>
        <meta name="description" content={product.title} />
      </Head>

      <div style={{ maxWidth: 1100, margin: "auto", padding: 20 }}>
        {/* ================= MAIN PRODUCT ================= */}
        <div style={{ display: "flex", gap: 20, background: "white", padding: 20 }}>
          <Image
            src={product.image || fallbackImage}
            width={400}
            height={400}
            alt={product.title}
          />

          <div style={{ flex: 1 }}>
            <h1>{product.title}</h1>

            <Stars rating={product.rating || 4.3} />

            <h2 style={{ color: "#B12704" }}>${price}</h2>

            <p style={{ color: "red", fontWeight: "bold" }}>
              {engine?.urgency}
            </p>

            <button
              onClick={() => window.open(product.link, "_blank")}
              style={{
                width: "100%",
                padding: 15,
                background: "#ff9900",
                border: 0,
                marginTop: 10,
                cursor: "pointer",
              }}
            >
              🛒 Buy Now
            </button>
          </div>
        </div>

        {/* ================= UPSSELL ================= */}
        <div style={{ marginTop: 30 }}>
          <h2>🔥 Better Deals (AI Picks)</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {engine?.upsells?.map((p) => (
              <div key={p.id} style={{ background: "white", padding: 10 }}>
                <p>{p.title}</p>
                <b>${p.price}</b>
                <Link href={`/product/${p.id}`}>View</Link>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CHEAPER ================= */}
        <div style={{ marginTop: 30 }}>
          <h2>💰 Budget Options</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {engine?.cheaperAlternatives?.map((p) => (
              <div key={p.id} style={{ background: "#fff", padding: 10 }}>
                <p>{p.title}</p>
                <b>${p.price}</b>
                <Link href={`/product/${p.id}`}>Compare</Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <AdBox />
        </div>
      </div>
    </div>
  );
}

/* ================= STATIC PATHS (FIX IS HERE 🔥) ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "products"));

  const paths = snap.docs.map((d) => ({
    params: { asin: d.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

/* ================= STATIC PROPS ================= */
export async function getStaticProps({ params }) {
  const snap = await getDocs(collection(db, "products"));

  const allProducts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const productDoc = allProducts.find((p) => p.id === params.asin);

  if (!productDoc) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: productDoc,
      allProducts,
    },
    revalidate: 3600,
  };
        }
