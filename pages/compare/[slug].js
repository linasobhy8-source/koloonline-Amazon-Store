import Head from "next/head";

/* ================= SCORE ENGINE ================= */
function getScore(p) {
  return (p.rating || 4) * 2 + (p.price || 0) * -0.01;
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
    <div
      style={{
        fontFamily: "Arial",
        padding: 20,
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>{p1.title} vs {p2.title} | Compare</title>

        <meta
          name="description"
          content={`Compare ${p1.title} and ${p2.title} and find the best deal`}
        />

        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={`${p1.title} vs ${p2.title}`} />
        <meta property="og:description" content="AI product comparison" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={p1.image || p2.image}
        />
      </Head>

      <h1>🔥 Product Comparison</h1>

      <h2>🏆 AI Winner: {winner}</h2>

      {/* ================= TABLE ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginTop: 20,
          background: "#fff",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <div></div>
        <div><b>{p1.title}</b></div>
        <div><b>{p2.title}</b></div>

        <div>Price</div>
        <div>${p1.price || 0}</div>
        <div>${p2.price || 0}</div>

        <div>Rating</div>
        <div>{p1.rating || 0}</div>
        <div>{p2.rating || 0}</div>

        <div>Score</div>
        <div>{score1.toFixed(2)}</div>
        <div>{score2.toFixed(2)}</div>
      </div>

      {/* ================= BUY LINKS ================= */}
      <div style={{ marginTop: 20 }}>
        <a
          href={p1.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          🛒 Buy {p1.title}
        </a>

        <br />

        <a
          href={p2.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          🛒 Buy {p2.title}
        </a>
      </div>
    </div>
  );
}

/* ================= ISR (FAST LOADING) ================= */
export async function getStaticProps({ params }) {
  const slug = params.slug;

  try {
    const { getProductsFast } = await import("../../lib/firebaseQuery");

    const products = await getProductsFast();

    if (!Array.isArray(products)) {
      return { notFound: true };
    }

    const keyword = String(slug)
      .toLowerCase()
      .replace("-vs-", " ");

    const filtered = products
      .filter((p) =>
        (p.title || "")
          .toLowerCase()
          .includes(keyword.split(" ")[0])
      )
      .slice(0, 2);

    const p1 = filtered[0] || null;
    const p2 = filtered[1] || null;

    return {
      props: {
        p1,
        p2,
        slug,
      },

      // 🔥 أهم تحسين أداء
      revalidate: 600, // 10 دقائق
    };
  } catch (e) {
    console.error("COMPARE ERROR:", e);
    return { notFound: true };
  }
}

/* ================= STATIC PATHS (LIMIT CACHE BOOST) ================= */
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
          }
