import Link from "next/link";

const linkStyle = {
  color: "#d1d5db",
  textDecoration: "none",
};

const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object") return v?.text || v?.title || "";
  return "";
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111827",
        color: "#fff",
        marginTop: 60,
        borderTop: "1px solid #1f2937",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "50px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 30,
        }}
      >
        <div>
          <h3>🟠 Koloonline</h3>
          <p style={{ color: "#9ca3af" }}>
            Smart Amazon Deals Platform
          </p>
        </div>

        <div>
          <h4>Pages</h4>
          <Link href="/about" style={linkStyle}>About</Link><br />
          <Link href="/contact" style={linkStyle}>Contact</Link><br />
          <Link href="/products" style={linkStyle}>Products</Link>
        </div>

        <div>
          <h4>Legal</h4>
          <Link href="/privacy" style={linkStyle}>Privacy</Link><br />
          <Link href="/terms" style={linkStyle}>Terms</Link>
        </div>

        <div>
          <h4>Trending</h4>
          <Link href="/blog" style={linkStyle}>Blog</Link><br />
          <Link href="/amazon-haul" style={linkStyle}>Amazon Haul</Link>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: 20, color: "#9ca3af" }}>
        © {new Date().getFullYear()} Koloonline
      </div>
    </footer>
  );
              }
