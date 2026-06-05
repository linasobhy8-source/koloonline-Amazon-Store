import { useState, useMemo } from "react";

export default function Navbar({ products = [] }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q) return [];

    return products
      .filter((p) =>
        (p.title || "").toLowerCase().includes(q.toLowerCase())
      )
      .slice(0, 5);
  }, [q, products]);

  return (
    <nav style={{ padding: 10, background: "#fff" }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search..."
      />

      {results.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </nav>
  );
          }
