import Head from "next/head";

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";

  if (typeof v === "object") {
    return v?.title || v?.text || v?.value || "";
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (v) => {
  if (typeof v === "string") return v;
  return v?.url || v?.image || v?.src || "";
};

/* ================= SCORE ENGINE ================= */
function getScore(p) {
  return safeNumber(p.rating) * 2 + safeNumber(p.price) * -0.01;
}

/* ================= PAGE ================= */
export default function ComparePage({ p1, p2, slug }) {
  if (!p1 || !p2) {
    return (
      <p style={{ padding: 20 }}>
        Not enough products to compare
      </p>
    );
  }

  const score1 = getScore(p1);
  const score2 = getScore(p2);

  const winner =
    score1 === score2
      ? "Tie"
      : score1 > score2
      ? p1.title
      : p2.title;

  const url = `https://koloonline.online/compare/${slug}`;

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <Head>
        <title>{p1.title} vs {p2.title} | Compare</title>

        <meta
          name="description"
          content={`Compare ${p1.title} and ${p2.title}`}
        />

        <link rel="canonical" href={url} />
      </Head>

      <h1>🔥 Product Comparison</h1>

      <h2>🏆 Winner: {winner}</h2>

      {/* TABLE */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div></div>
        <div><b>{p1.title}</b></div>
        <div><b>{p2.title}</b></div>

        <div>Price</div>
        <div>${p1.price}</div>
        <div>${p2.price}</div>

        <div>Rating</div>
        <div>{p1.rating}</div>
        <div>{p2.rating}</div>

        <div>Score</div>
        <div>{score1.toFixed(2)}</div>
        <div>{score2.toFixed(2)}</div>
      </div>

      {/* BUY LINKS */}
      <div style={{ marginTop: 20 }}>
        {p1.link && (
          <a href={p1.link} target="_blank" rel="noopener noreferrer sponsored">
            🛒 Buy {p1.title}
          </a>
        )}

        <br />

        {p2.link && (
          <a href={p2.link} target="_blank" rel="noopener noreferrer sponsored">
            🛒 Buy {p2.title}
          </a>
        )}
      </div>
    </div>
  );
}

/* ================= ISR ================= */
export async function getStaticProps({ params }) {
  try {
    const { getProductsFast } = await import("../../lib/firebaseQuery");

    const products = await getProductsFast(); // ✅ صح زي ما طلبت

    if (!Array.isArray(products)) {
      return { notFound: true };
    }

    const keyword = String(params.slug || "")
      .toLowerCase()
      .replace("-vs-", " ");

    const filtered = products
      .filter((p) =>
        String(p?.title || "").toLowerCase().includes(keyword.split(" ")[0])
      )
      .slice(0, 2)
      .map((p) => ({
        id: p.id,
        title: safeText(p.title),
        price: safeNumber(p.price),
        rating: safeNumber(p.rating),
        image: safeImage(p.image),
        link: p.link || "",
      }));

    const p1 = filtered[0] || null;
    const p2 = filtered[1] || null;

    return {
      props: { p1, p2, slug: params.slug },
      revalidate: 600,
    };
  } catch (e) {
    console.error("COMPARE ERROR:", e);
    return { notFound: true };
  }
}

/* ================= PATHS ================= */
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
    }
