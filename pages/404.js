import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <h1>😢 Page Not Found</h1>
      <p>The product you're looking for doesn't exist.</p>

      <Link href="/">
        <button style={{
          padding: 10,
          background: "#ff9900",
          border: "none",
          marginTop: 20
        }}>
          🏠 Go Home
        </button>
      </Link>
    </div>
  );
}
