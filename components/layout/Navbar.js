import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "#111827",
        color: "white",
        padding: "14px 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: 26,
            fontWeight: "bold",
          }}
        >
          🟠 Koloonline
        </Link>

        <nav
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
          }}
        >
          <Link href="/products" style={{ color: "white" }}>
            Products
          </Link>

          <Link href="/categories" style={{ color: "white" }}>
            Categories
          </Link>

          <Link href="/blog" style={{ color: "white" }}>
            Blog
          </Link>

          <Link href="/dashboard" style={{ color: "white" }}>
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
          }
