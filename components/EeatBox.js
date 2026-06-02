import Link from "next/link";

export default function EeatBox() {
  return (
    <div style={styles.container}>
      
      {/* ================= TITLE ================= */}
      <h3 style={styles.title}>🛡️ Why trust Koloonline?</h3>

      {/* ================= POINTS ================= */}
      <ul style={styles.list}>
        <li>✔ Structured and informational product reviews</li>
        <li>✔ Regularly updated Amazon deals & guides</li>
        <li>✔ Transparent affiliate disclosure (we may earn commission)</li>
        <li>✔ User-first content designed to help buying decisions</li>
        <li>✔ Real-time data from trusted product sources</li>
      </ul>

      {/* ================= TRUST BADGES ================= */}
      <div style={styles.badges}>
        <span>🔒 Secure Content</span>
        <span>⚡ Fast Updates</span>
        <span>📊 Data-Driven</span>
      </div>

      {/* ================= FOOT NOTE ================= */}
      <p style={styles.note}>
        We follow Google quality guidelines for helpful content and AdSense compliance.
      </p>

      {/* ================= OPTIONAL LINK ================= */}
      <Link href="/about" style={styles.link}>
        Learn more about us →
      </Link>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    marginTop: 40,
    padding: 20,
    background: "#f9f9f9",
    borderRadius: 12,
    fontSize: 14,
    border: "1px solid #eee",
  },

  title: {
    marginBottom: 10,
    fontSize: 16,
  },

  list: {
    paddingLeft: 18,
    lineHeight: 1.8,
  },

  badges: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 15,
    fontSize: 12,
    color: "#555",
  },

  note: {
    marginTop: 15,
    fontSize: 12,
    color: "#666",
  },

  link: {
    display: "inline-block",
    marginTop: 10,
    color: "#007185",
    textDecoration: "none",
    fontWeight: 500,
  },
};
