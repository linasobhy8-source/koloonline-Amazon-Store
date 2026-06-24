import Head from "next/head";
import { useState, useMemo } from "react";

export default function SearchPage({ products = [] }) {
  const [q, setQ] = useState("");

  const safeProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.map((item, index) => ({
      id: String(item?.id || index),
      title:
        typeof item?.title === "string"
          ? item.title
          : "Untitled Product",
      price: Number(item?.price || 0),
    }));
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();

    return safeProducts.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
  }, [q, safeProducts]);

  return (
    <>
      <Head>
        <title>Search | Koloonline</title>
      </Head>

      <div style={{ padding: 20 }}>
        <h1>Search Products</h1>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
