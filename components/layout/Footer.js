import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111827",
        color: "white",
        padding: "50px 20px",
        marginTop: 60,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "auto",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(200px,1fr))",
          gap: 30,
        }}
      >
        {/* BRAND */}
        <div>
          <h3>🟠 Koloonline</h3>
          <p style={{ color: "#aaa" }}>
            Smart Amazon Deals Platform
            powered by AI trend engine.
          </p>
        </div>

        {/* PAGES */}
        <div>
          <h4>Pages</h4>
          <Link href="/about">About</Link>
          <br />
          <Link href="/contact">Contact</Link>
          <br />
          <Link href="/products">Products</Link>
        </div>

        {/* LEGAL */}
        <div>
          <h4>Legal</h4>
          <Link href="/privacy">Privacy</Link>
          <br />
          <Link href="/terms">Terms</Link>
        </div>

        {/* EXTRA SEO LINKS */}
        <div>
          <h4>Trending</h4>
          <Link href="/blog">Blog</Link>
          <br />
          <Link href="/amazon-haul">
            Amazon Haul
          </Link>
        </div>
      </div>
    </footer>
  );
          }
