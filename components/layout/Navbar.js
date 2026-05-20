import { useState } from "react";
import Link from "next/link";

export default function Navbar({ products = [] }) {
  const [search, setSearch] = useState("");

  const filtered = products
    .filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5);

  return (
    <nav style={{
      padding: 15,
      background: "white",
      borderBottom: "1px solid #eee",
      position: "sticky",
      top: 0,
      zIndex: 999
    }}>

      <div style={{
        maxWidth: 1200,
        margin: "auto",
        display: "flex",
        gap: 20,
        alignItems: "center"
      }}>

        <Link href="/">
          <h2>🟠 Koloonline</h2>
        </Link>

        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 10
          }}
        />

        <Link href="/products">Products</Link>
        <Link href="/blog">Blog</Link>

      </div>

      {/* LIVE SEARCH */}
      {search && (
        <div style={{
          maxWidth: 1200,
          margin: "auto",
          background: "#fff",
          padding: 10
        }}>
          {filtered.map((p) => (
            <div key={p.id}>
              <Link href={`/product/${p.asin}`}>
                {p.title}
              </Link>
            </div>
          ))}
        </div>
      )}

    </nav>
  );
  }
