import Link from "next/link";
import Head from "next/head";

export default function Breadcrumb({ items }) {
  const baseUrl = "https://koloonline.online";

  const safeItems = Array.isArray(items)
    ? items.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.name &&
          item.link
      )
    : [];

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: safeItems.map(
                (item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: String(item.name),
                  item: `${baseUrl}${item.link}`,
                })
              ),
            }),
          }}
        />
      </Head>

      <nav
        aria-label="breadcrumb"
        style={styles.container}
      >
        {safeItems.map((item, index) => (
          <span
            key={`${item.link}-${index}`}
            style={styles.item}
          >
            <Link
              href={String(item.link)}
              style={styles.link}
            >
              {String(item.name)}
            </Link>

            {index < safeItems.length - 1 && (
              <span style={styles.separator}>
                ›
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

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
