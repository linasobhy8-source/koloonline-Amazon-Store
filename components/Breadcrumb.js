export default function Breadcrumb({ items = [] }) {
  return (
    <div style={styles.container}>

      {items.map((item, index) => (
        <span key={index} style={styles.item}>
          
          <a href={item.link} style={styles.link}>
            {item.name}
          </a>

          {index < items.length - 1 && (
            <span style={styles.separator}>›</span>
          )}

        </span>
      ))}

    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    fontSize: 12,
    padding: "10px 0",
    color: "#555",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },

  item: {
    display: "flex",
    alignItems: "center",
  },

  link: {
    color: "#007185",
    textDecoration: "none",
  },

  separator: {
    margin: "0 6px",
    color: "#999",
  },
};
