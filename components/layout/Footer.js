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
          maxWidth: 1400,
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 30,
        }}
      >
        <div>
          <h3>Koloonline</h3>
          <p>Smart Amazon Deals Platform.</p>
        </div>

        <div>
          <h4>Pages</h4>
          <Link href="/about">About</Link>
          <br />
          <Link href="/contact">Contact</Link>
        </div>

        <div>
          <h4>Legal</h4>
          <Link href="/privacy">Privacy</Link>
          <br />
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
