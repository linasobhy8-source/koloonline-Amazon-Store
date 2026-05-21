import { useState, useMemo } from "react";
import Link from "next/link";

export default function Navbar({ products = [] }) {
  const [search, setSearch] = useState("");

  /* ================= SMART FILTER ================= */
  const filtered = useMemo(() => {
    if (!search) return [];

    return products
      .filter((p) =>
        (p.title || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          (b.views || 0) +
          (b.clicks || 0) * 2 -
          ((a.views || 0) +
            (a.clicks || 0) * 2)
      )
      .slice(0, 6);
  }, [search, products]);

  return (
    <nav
      style={{
        padding: 15,
        background: "white",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "auto",
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* LOGO */}
        <Link href="/">
          <h2 style={{ margin: 0 }}>🟠 Koloonline</h2>
        </Link>

        {/* SEARCH */}
        <input
          placeholder="Search trending products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 10,
          }}
        />

        {/* LINKS */}
        <Link href="/products">Products</Link>
        <Link href="/blog">Blog</Link>
      </div>

      {/* LIVE SEARCH DROPDOWN */}
      {filtered.length > 0 && (
        <div
          style={{
            maxWidth: 1200,
            margin: "auto",
            background: "#fff",
            padding: 10,
            borderRadius: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {filtered.map((p) => (
            <Link
              key={p.asin}
              href={`/product/${p.asin}`}
              style={{
                display: "block",
                padding: 8,
                borderBottom: "1px solid #eee",
                textDecoration: "none",
                color: "#111",
              }}
            >
              {p.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
