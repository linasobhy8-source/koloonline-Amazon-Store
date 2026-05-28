import Link from "next/link";

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
        {/* BRAND */}
        <div>
          <h3
            style={{
              marginTop: 0,
            }}
          >
            🟠 Koloonline
          </h3>

          <p
            style={{
              color: "#9ca3af",
              lineHeight: 1.7,
            }}
          >
            Smart Amazon Deals Platform
            powered by AI trend discovery
            and affiliate technology.
          </p>
        </div>

        {/* PAGES */}
        <div>
          <h4>Pages</h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link
              href="/about"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              About
            </Link>

            <Link
              href="/contact"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              Contact
            </Link>

            <Link
              href="/products"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              Products
            </Link>
          </div>
        </div>

        {/* LEGAL */}
        <div>
          <h4>Legal</h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link
              href="/privacy"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              Terms of Service
            </Link>

            <Link
              href="/disclaimer"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              Disclaimer
            </Link>
          </div>
        </div>

        {/* SEO LINKS */}
        <div>
          <h4>Trending</h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link
              href="/blog"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              Blog
            </Link>

            <Link
              href="/amazon-haul"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
              Amazon Haul
            </Link>

            <Link
              href="/categories"
              style={{
                color: "#d1d5db",
                textDecoration: "none",
              }}
            >
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
        © 2026 Koloonline. All rights reserved.
      </div>
    </footer>
  );
}
