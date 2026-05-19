import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../config/firebase";

export default function ComparePage() {

  const router = useRouter();

  const { slug } = router.query;

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!slug) return;

    const load = async () => {

      try {

        const snap = await getDocs(
          collection(db, "products")
        );

        const all =
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

        const cleanSlug =
          String(slug)
            .toLowerCase()
            .replaceAll("-", " ");

        const matched =
          all.filter((p) =>
            p.title
              ?.toLowerCase()
              .includes(cleanSlug.split(" ")[0])
          );

        setProducts(
          matched.slice(0, 2)
        );

      } catch (e) {

        console.log(e);

      } finally {

        setLoading(false);

      }
    };

    load();

  }, [slug]);

  if (loading) {
    return (
      <p style={{ padding: 20 }}>
        Loading...
      </p>
    );
  }

  if (products.length < 2) {
    return (
      <p style={{ padding: 20 }}>
        Not enough products to compare.
      </p>
    );
  }

  const p1 = products[0];
  const p2 = products[1];

  const title =
    `${p1.title} vs ${p2.title}`;

  const description =
    `Compare ${p1.title} and ${p2.title} to find the best Amazon deal.`;

  const url =
    `https://koloonline.online/compare/${slug}`;

  /* ================= SCHEMA ================= */

  const schema = {
    "@context":
      "https://schema.org",

    "@type":
      "Article",

    headline: title,

    description,

    mainEntityOfPage: url,
  };

  return (

    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        background: "#f5f5f5",
      }}
    >

      {/* ================= SEO ================= */}

      <Head>

        <title>
          {title} | Comparison
        </title>

        <meta
          name="description"
          content={description}
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href={url}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(schema),
          }}
        />

      </Head>

      {/* ================= TITLE ================= */}

      <h1>
        🔥 {title}
      </h1>

      <p>
        Compare features, pricing,
        and smart buying value.
      </p>

      {/* ================= GRID ================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",

          gap: 20,

          marginTop: 30,
        }}
      >

        {[p1, p2].map((p) => (

          <div
            key={p.id}

            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >

            <img
              src={p.image}
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "contain",
              }}
            />

            <h2>
              {p.title}
            </h2>

            <h3
              style={{
                color: "red",
              }}
            >
              ${p.price}
            </h3>

            <p>
              ⭐ Rating:
              {p.rating || 4.5}
            </p>

            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                style={{
                  padding: 12,
                  background:
                    "#ff9900",

                  border: "none",

                  color: "white",

                  cursor: "pointer",

                  width: "100%",
                }}
              >
                Buy on Amazon
              </button>
            </a>

          </div>

        ))}

      </div>

    </div>
  );
}
