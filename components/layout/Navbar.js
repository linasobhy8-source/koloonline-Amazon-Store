import { useState, useMemo } from "react";
import Link from "next/link";

export default function Navbar({ products = [] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return [];

    const t = search.toLowerCase();

    return products
      .filter((p) => (p?.title || "").toLowerCase().includes(t))
      .slice(0, 5);
  }, [search, products]);

  return (
    <nav style={{ position: "sticky", top: 0, background: "#fff", zIndex: 999 }}>
      <div style={{ display: "flex", gap: 10, padding: 12 }}>
        <Link href="/">Koloonline</Link>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
      </div>

      {filtered.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #eee" }}>
          {filtered.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <div style={{ padding: 10 }}>{p.title}</div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
