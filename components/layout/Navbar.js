import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";

/* ================= SAFE ================= */
const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") return v?.text || v?.title || v?.name || "";
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  return "";
};

export default function Navbar({ products = [] }) {
  const [q, setQ] = useState("");
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  /* ================= DEBOUNCE SEARCH ================= */
  const handleSearch = (value) => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setQ(String(value || ""));
    }, 150);
  };

  /* ================= FILTER ================= */
  const results = useMemo(() => {
    const query = String(q || "").trim().toLowerCase();

    if (!query) return [];
    if (!Array.isArray(products)) return [];

    return products
      .filter((p) => p && typeof p === "object")
      .slice(0, 200)
      .filter((p) =>
        String(p?.title || "").toLowerCase().includes(query)
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
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <input
          type="search"
          onChange={(e) => handleSearch(e.target.value)}
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
            {results.map((p, i) => {
              const id = String(p?.id || "");
              const title = safeText(p?.title);

              if (!id) return null;

              return (
                <Link
                  key={id}
                  href={`/product/${encodeURIComponent(id)}`}
                  style={{
                    display: "block",
                    padding: "10px",
                    color: "#111827",
                    textDecoration: "none",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  {title || "Product"}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
              }
