import { useState, useMemo } from "react";
import Link from "next/link";

export default function Navbar({
  products = [],
}) {
  const [search, setSearch] =
    useState("");

  const filtered = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    if (!term) return [];

    return products
      .filter((p) =>
        String(
          p?.title || ""
        )
          .toLowerCase()
          .includes(term)
      )
      .sort(
        (a, b) =>
          ((b?.views || 0) +
            (b?.clicks || 0) * 2) -
          ((a?.views || 0) +
            (a?.clicks || 0) * 2)
      )
      .slice(0, 6);
  }, [search, products]);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#ffffffee",
        backdropFilter: "blur(8px)",
        borderBottom:
          "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* LOGO */}

        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#111827",
            fontWeight: 700,
            fontSize: 20,
            whiteSpace: "nowrap",
          }}
        >
          🟠 Koloonline
        </Link>

        {/* SEARCH */}

        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            minWidth: 180,
            padding: "10px 12px",
            border:
              "1px solid #d1d5db",
            borderRadius: 10,
            outline: "none",
          }}
        />

        {/* NAV LINKS */}

        <Link
          href="/products"
          style={{
            textDecoration: "none",
            color: "#111827",
            fontWeight: 500,
          }}
        >
          Products
        </Link>

        <Link
          href="/blog"
          style={{
            textDecoration: "none",
            color: "#111827",
            fontWeight: 500,
          }}
        >
          Blog
        </Link>
      </div>

      {/* SEARCH RESULTS */}

      {filtered.length > 0 && (
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 16px 12px",
          }}
        >
          <div
            style={{
              background: "#fff",
              border:
                "1px solid #e5e7eb",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow:
                "0 4px 20px rgba(0,0,0,.08)",
            }}
          >
            {filtered.map((p) => (
              <Link
                key={
                  p?.asin ||
                  p?.id ||
                  Math.random()
                }
                href={`/product/${
                  p?.asin || p?.id
                }`}
                style={{
                  display: "block",
                  padding: 12,
                  textDecoration:
                    "none",
                  color: "#111827",
                  borderBottom:
                    "1px solid #f3f4f6",
                }}
              >
                {String(
                  p?.title ||
                    "Product"
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
