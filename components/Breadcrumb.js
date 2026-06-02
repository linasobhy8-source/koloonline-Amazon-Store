import Link from "next/link";
import Head from "next/head";

export default function Breadcrumb({ items = [] }) {
  const baseUrl = "https://koloonline.online";

  return (
    <>
      {/* ================= SEO STRUCTURED DATA (IMPORTANT FOR GOOGLE + ADSENSE) ================= */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: `${baseUrl}${item.link}`,
              })),
            }),
          }}
        />
      </Head>

      {/* ================= BREADCRUMB UI ================= */}
      <nav aria-label="breadcrumb" style={styles.container}>
        {items.map((item, index) => (
          <span key={index} style={styles.item}>
            <Link href={item.link} style={styles.link}>
              {item.name}
            </Link>

            {index < items.length - 1 && (
              <span style={styles.separator}>›</span>
            )}
          </span>
        ))}
      </nav>
    </>
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
    fontWeight: 500,
  },

  separator: {
    margin: "0 6px",
    color: "#999",
  },
};
