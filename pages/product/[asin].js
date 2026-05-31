import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/600x600?text=Koloonline";

/* ================= LEVEL 7 AI REVENUE BRAIN ================= */
function useRevenueBrain(product, allProducts = []) {
  return useMemo(() => {
    if (!product) return null;

    const price = Number(product.price || 0);
    const clicks = product.clicks || 0;
    const orders = product.orders || 0;
    const views = product.views || 0;

    /* ================= CORE METRICS ================= */
    const ctr = views ? clicks / views : 0;
    const conv = clicks ? orders / clicks : 0;

    const baseRevenue = orders * price;

    /* ================= PROFIT MODEL ================= */
    const marginBoost =
      product.category === "electronics" ? 1.3 :
      product.category === "fashion" ? 1.1 : 1.0;

    const profitScore =
      (conv * price * 10) +
      (baseRevenue * 0.5) +
      (ctr * 100) * marginBoost;

    /* ================= VIRAL SCORE ================= */
    const viralScore =
      views * 0.2 +
      clicks * 1.8 +
      orders * 6 +
      ctr * 120 +
      conv * 180 +
      (product.viralBoost ? 120 : 0);

    /* ================= AUTO UPSELL ENGINE ================= */
    const upsells = allProducts
      .filter(p =>
        p.id !== product.id &&
        Number(p.price) > price &&
        p.category === product.category
      )
      .sort((a, b) =>
        (b.orders || 0) * (b.price || 1) -
        (a.orders || 0) * (a.price || 1)
      )
      .slice(0, 3);

    /* ================= CROSS CATEGORY FUNNEL ================= */
    const crossSell = allProducts
      .filter(p =>
        p.id !== product.id &&
        Math.abs(Number(p.price) - price) < price * 0.3
      )
      .slice(0, 3);

    /* ================= BUDGET TRAP ================= */
    const budgetTrap = allProducts
      .filter(p =>
        Number(p.price) < price * 0.6
      )
      .sort((a, b) =>
        (b.clicks || 0) - (a.clicks || 0)
      )
      .slice(0, 2);

    /* ================= AUTO URGENCY ================= */
    let urgency = "⚡ Standard Offer";

    if (profitScore > 2000) {
      urgency = "🔥 HIGH PROFIT PRODUCT - PUSH HARD";
    } else if (viralScore > 5000) {
      urgency = "🚀 VIRAL POTENTIAL DETECTED";
    } else if (conv > 0.2) {
      urgency = "⏳ Limited Stock - High Demand";
    }

    return {
      profitScore,
      viralScore,
      urgency,
      upsells,
      crossSell,
      budgetTrap,
    };
  }, [product, allProducts]);
}

/* ================= PAGE ================= */
export default function ProductPage({ product, allProducts }) {
  const brain = useRevenueBrain(product, allProducts);

  if (!product) return <div>Not Found</div>;

  const price = Number(product.price || 0);

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>
      <Head>
        <title>{product.title} | Level 7 AI Store</title>
      </Head>

      <div style={{ maxWidth: 1100, margin: "auto", padding: 20 }}>
        
        {/* ================= PRODUCT CORE ================= */}
        <div style={{
          display: "flex",
          gap: 20,
          background: "white",
          padding: 20
        }}>
          
          <Image
            src={product.image || fallbackImage}
            width={400}
            height={400}
            alt={product.title}
          />

          <div style={{ flex: 1 }}>
            <h1>{product.title}</h1>

            <h2 style={{ color: "#B12704" }}>${price}</h2>

            {/* 🧠 LEVEL 7 INSIGHT */}
            <p style={{ color: "red", fontWeight: "bold" }}>
              {brain?.urgency}
            </p>

            <p>
              Profit Score: {brain?.profitScore?.toFixed(2)}
            </p>

            <p>
              Viral Score: {brain?.viralScore?.toFixed(2)}
            </p>

            <button
              onClick={() => window.open(product.link, "_blank")}
              style={{
                width: "100%",
                padding: 15,
                background: "#ff9900",
                border: 0,
                marginTop: 10,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🛒 BUY NOW (AI OPTIMIZED)
            </button>
          </div>
        </div>

        {/* ================= UPSELL ================= */}
        <h2>🔥 Revenue Upsells</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {brain?.upsells?.map(p => (
            <div key={p.id} style={{ background: "white", padding: 10 }}>
              <b>{p.title}</b>
              <p>${p.price}</p>
              <Link href={`/product/${p.id}`}>Upgrade</Link>
            </div>
          ))}
        </div>

        {/* ================= CROSS SELL ================= */}
        <h2>🎯 Conversion Boosters</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {brain?.crossSell?.map(p => (
            <div key={p.id} style={{ background: "#fff", padding: 10 }}>
              <b>{p.title}</b>
              <p>${p.price}</p>
              <Link href={`/product/${p.id}`}>Compare</Link>
            </div>
          ))}
        </div>

        {/* ================= BUDGET TRAP ================= */}
        <h2>💰 Budget Conversion Layer</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {brain?.budgetTrap?.map(p => (
            <div key={p.id} style={{ background: "#fff", padding: 10 }}>
              <b>{p.title}</b>
              <p>${p.price}</p>
              <Link href={`/product/${p.id}`}>Switch</Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ================= STATIC ================= */
export async function getStaticPaths() {
  const snap = await getDocs(collection(db, "products"));

  return {
    paths: snap.docs.map(d => ({
      params: { asin: d.id }
    })),
    fallback: "blocking"
  };
}

export async function getStaticProps({ params }) {
  const snap = await getDocs(collection(db, "products"));

  const allProducts = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  const product = allProducts.find(p => p.id === params.asin);

  if (!product) return { notFound: true };

  return {
    props: {
      product,
      allProducts
    },
    revalidate: 3600
  };
  }
