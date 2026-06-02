import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: 50,
        fontFamily: "Arial",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>404 - Page Not Found | Koloonline</title>
        <meta
          name="description"
          content="This page does not exist on Koloonline."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <h1 style={{ fontSize: 40 }}>😢 Page Not Found</h1>

      <p style={{ color: "#666" }}>
        The product or page you're looking for doesn't exist.
      </p>

      <Link href="/">
        <button
          style={{
            padding: "12px 20px",
            background: "#ff9900",
            border: "none",
            marginTop: 20,
            cursor: "pointer",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          🏠 Go Home
        </button>
      </Link>
    </div>
  );
            }
