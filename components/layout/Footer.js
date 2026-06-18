import Link from "next/link";

const linkStyle = {
  color: "#d1d5db",
  textDecoration: "none",
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111827",
        color: "#ffffff",
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
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 30,
        }}
      >
        <div>
          <h3 style={{ marginTop: 0 }}>
            🟠 Koloonline
          </h3>

          <p
            style={{
              color: "#9ca3af",
              lineHeight: 1.7,
            }}
          >
            Smart Amazon Deals Platform powered by AI trend
            discovery and affiliate technology.
          </p>
        </div>

        <div>
          <h4>Pages</h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link href="/about" style={linkStyle}>
              About
            </Link>

            <Link href="/contact" style={linkStyle}>
              Contact
            </Link>

            <Link href="/products" style={linkStyle}>
              Products
            </Link>
          </div>
        </div>

        <div>
          <h4>Legal</h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link href="/privacy" style={linkStyle}>
              Privacy Policy
            </Link>

            <Link href="/terms" style={linkStyle}>
              Terms of Service
            </Link>

            <Link href="/disclaimer" style={linkStyle}>
              Disclaimer
            </Link>
          </div>
        </div>

        <div>
          <h4>Trending</h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link href="/blog" style={linkStyle}>
              Blog
            </Link>

            <Link href="/amazon-haul" style={linkStyle}>
              Amazon Haul
            </Link>

            <Link href="/categories" style={linkStyle}>
              Categories
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #1f2937",
          textAlign: "center",
          padding: "20px",
          color: "#9ca3af",
          fontSize: 14,
        }}
      >
        © {new Date().getFullYear()} Koloonline. All rights reserved.
      </div>
    </footer>
  );
}
