import Head from "next/head";

/* ================= SAFE HELPERS ================= */

const safeText = (v) => {
  if (v == null) return "";

  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    return v?.title || v?.text || v?.name || v?.value || "";
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeImage = (v) => {
  if (typeof v === "string") return v;

  if (v && typeof v === "object") {
    return v.url || v.image || v.src || "";
  }

  return "";
};

/* ================= SCORE ================= */

function getScore(p = {}) {
  return safeNumber(p.rating) * 2 + safeNumber(p.price) * -0.01;
}

/* ================= PAGE ================= */

export default function ComparePage({ p1, p2, slug }) {
  if (!p1 || !p2) {
    return <div style={{ padding: 20 }}>Not enough products to compare</div>;
  }

  // 🔥 HARD CAST (IMPORTANT FOR React #130)
  const title1 = String(safeText(p1.title));
  const title2 = String(safeText(p2.title));

  const price1 = safeNumber(p1.price);
  const price2 = safeNumber(p2.price);

  const rating1 = safeNumber(p1.rating);
  const rating2 = safeNumber(p2.rating);

  const score1 = getScore(p1);
  const score2 = getScore(p2);

  const winner =
    score1 === score2
      ? "Tie"
      : score1 > score2
      ? title1
      : title2;

  const url = `https://koloonline.online/compare/${slug}`;

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>{`${title1} vs ${title2} | Compare`}</title>

        <meta
          name="description"
          content={`Compare ${title1} and ${title2}`}
        />

        <link rel="canonical" href={url} />
      </Head>

      <h1>🔥 Product Comparison</h1>

      <h2>🏆 Winner: {String(winner)}</h2>

      {/* TABLE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
        }}
      >
        <div></div>
        <div><b>{title1}</b></div>
        <div><b>{title2}</b></div>

        <div>Price</div>
        <div>${price1}</div>
        <div>${price2}</div>

        <div>Rating</div>
        <div>{rating1}</div>
        <div>{rating2}</div>

        <div>Score</div>
        <div>{score1.toFixed(2)}</div>
        <div>{score2.toFixed(2)}</div>
      </div>

      {/* BUY LINKS */}
      <div style={{ marginTop: 20 }}>
        {p1.link && (
          <a href={p1.link} target="_blank" rel="noopener noreferrer">
            🛒 Buy {title1}
          </a>
        )}

        <br />

        {p2.link && (
          <a href={p2.link} target="_blank" rel="noopener noreferrer">
            🛒 Buy {title2}
          </a>
        )}
      </div>
    </div>
  );
}

/* ================= DATA ================= */

export async function getStaticProps({ params }) {
  try {
    const { getProductsFast } = await import("../../lib/firebaseQuery");

    const products = await getProductsFast();

    const keyword = String(params.slug || "")
      .toLowerCase()
      .replace("-vs-", " ");

    const filtered = (products || [])
      .filter((p) =>
        String(p?.title || "").toLowerCase().includes(keyword.split(" ")[0])
      )
      .slice(0, 2)
      .map((p) => ({
        id: String(p.id || ""),
        title: safeText(p.title),
        price: safeNumber(p.price),
        rating: safeNumber(p.rating),
        image: safeImage(p.image),
        link: p.link || "",
      }));

    return {
      props: {
        p1: filtered[0] || null,
        p2: filtered[1] || null,
        slug: params.slug,
      },
      revalidate: 600,
    };
  } catch (e) {
    console.error(e);
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
