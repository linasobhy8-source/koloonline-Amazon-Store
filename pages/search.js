import Head from "next/head";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { normalizeProduct } from "../lib/dataFirewall";

export default function SearchPage(props) {
  // 🔥 HARD SAFE GUARD (مهم جدًا)
  const products = Array.isArray(props?.products) ? props.products : [];

  const [q, setQ] = useState("");

  const safeProducts = useMemo(() => {
    return products
      .filter((p) => p && typeof p === "object")
      .map(normalizeProduct)
      .filter((p) => p.id && p.title);
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();

    return safeProducts
      .filter((p) => (p.title || "").toLowerCase().includes(query))
      .slice(0, 50);
  }, [q, safeProducts]);

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Search | Koloonline</title>
      </Head>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value || "")}
        placeholder="Search..."
        style={{ width: "100%", padding: 12 }}
      />

      <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
        {filtered.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div style={{ border: "1px solid #ddd", padding: 10 }}>
              {/* 🔥 HARD SAFE IMAGE */}
              <Image
                src={typeof p.image === "string" ? p.image : ""}
                width={300}
                height={300}
                alt={typeof p.title === "string" ? p.title : "product"}
                unoptimized
              />

              <h3>{typeof p.title === "string" ? p.title : ""}</h3>
              <p>${Number(p.price || 0)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= SAFE STATIC ================= */
export async function getStaticProps() {
  try {
    const { getProductsFast } = await import("../lib/firebaseQuery");

    const products = await getProductsFast();

    return {
      props: {
        products: Array.isArray(products) ? products : [],
      },
      revalidate: 300,
    };
  } catch {
    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
  }
