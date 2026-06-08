import Link from "next/link";
import { useState, useMemo } from "react";

export default function Navbar({ products = [] }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q?.trim()) return [];

    return products
      .filter((p) =>
        String(p?.title || "")
          .toLowerCase()
          .includes(q.toLowerCase())
      )
      .slice(0, 5);
  }, [q, products]);

  return (
    <nav
      style={{
        padding: "12px 20px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
          }}
        />

        {results.length > 0 && (
          <div
            style={{
              marginTop: 10,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {results.map((p) => (
              <Link
                key={String(p.id)}
                href={`/product/${p.id}`}
                style={{
                  display: "block",
                  padding: "10px",
                  color: "#111827",
                  textDecoration: "none",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                {String(p.title || "Product")}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
