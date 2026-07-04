
export async function getServerSideProps({ res }) {
  res.setHeader("X-Robots-Tag", "noindex, follow");

  return {
    props: {},
  };
}

export default function Contact() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>

      <p style={styles.text}>
        This page is for support only and is not indexed by search engines.
      </p>

      <div style={styles.card}>
        <h3>📩 Support Email</h3>
        <p>support@koloonline.online</p>
      </div>

      <div style={styles.card}>
        <h3>🛒 Store</h3>
        <p>Browse trending Amazon products and deals.</p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    color: "#232f3e",
  },

  text: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  card: {
    background: "#fff",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: 15,
  },
};
