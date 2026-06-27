import Head from "next/head";
import Link from "next/link";

const BASE_URL = "https://koloonline.online";

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        item.name.trim() &&
        typeof item.link === "string" &&
        item.link.trim()
    )
    .map((item) => ({
      name: item.name.trim(),
      link: item.link.startsWith("http")
        ? item.link
        : `${BASE_URL}${item.link}`,
      href: item.link.startsWith("http")
        ? item.link
        : item.link,
    }));
}

export default function Breadcrumb({ items = [] }) {
  const breadcrumbItems = normalizeItems(items);

  return (
    <>
      {breadcrumbItems.length > 0 && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbItems.map(
                  (item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.name,
                    item: item.link,
                  })
                ),
              }),
            }}
          />
        </Head>
      )}

      <nav
        aria-label="Breadcrumb"
        style={styles.container}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast =
            index === breadcrumbItems.length - 1;

          return (
            <span
              key={`${item.link}-${index}`}
              style={styles.item}
            >
              {isLast ? (
                <span
                  aria-current="page"
                  style={styles.current}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  style={styles.link}
                >
                  {item.name}
                </Link>
              )}

              {!isLast && (
                <span
                  aria-hidden="true"
                  style={styles.separator}
                >
                  ›
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 0,
    padding: "10px 0",
    fontSize: 13,
    color: "#555",
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

  current: {
    color: "#222",
    fontWeight: 600,
  },

  separator: {
    margin: "0 8px",
    color: "#999",
  },
};
