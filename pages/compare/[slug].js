import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= SCORE ENGINE ================= */
function getScore(p) {
  return (p.rating || 4) * 2 + (p.price || 0) * -0.01;
}

/* ================= PAGE ================= */
export default function ComparePage() {
  const router = useRouter();
  const { slug } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(db, "products"));

        const all = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const keyword = String(slug)
          .toLowerCase()
          .split("-")[0];

        const matched = all
          .filter((p) =>
            (p.title || "")
              .toLowerCase()
              .includes(keyword)
          )
          .slice(0, 2);

        setProducts(matched);
      } catch (err) {
        console.error("Compare error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  /* ================= STATES ================= */
  if (loading)
    return <p style={{ padding: 20 }}>Loading...</p>;

  if (products.length < 2)
    return (
      <p style={{ padding: 20 }}>
        Not enough products to compare
      </p>
    );

  const [p1, p2] = products;

  const winner =
    getScore(p1) > getScore(p2)
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
        <title>
          {p1.title} vs {p2.title} | Compare
        </title>

        <meta
          name="description"
          content={`Compare ${p1.title} and ${p2.title} - find the best deal`}
        />

        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />

        <meta property="og:title" content="Product Comparison" />
        <meta property="og:description" content="AI product comparison" />
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
      </div>

      {/* ================= BUY LINKS ================= */}
      <div style={{ marginTop: 20 }}>
        <a
          href={p1.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          🛒 Buy {p1.title}
        </a>

        <br />

        <a
          href={p2.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          🛒 Buy {p2.title}
        </a>
      </div>
    </div>
  );
}
