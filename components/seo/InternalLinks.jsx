import Link from "next/link";

export default function InternalLinks({
  items = [],
  title = "Related Products",
}) {
  if (!items || items.length === 0) return null;

  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ borderTop: "1px solid #eee", paddingTop: 20 }}>
        
        <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          {title}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 15,
          }}
        >
          {items.map((item, index) => {
            const id = item.asin || item.id || item.slug || index;

            const href = item.asin
              ? `/product/${item.asin}`
              : item.slug
              ? `/blog/${item.slug}`
              : "#";

            return (
              <Link key={id} href={href}>
                <div
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: 15,
                    background: "#fff",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title || "Untitled Product"}
                  </div>

                  {item.price !== undefined && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: "#B12704",
                        fontWeight: "bold",
                      }}
                    >
                      ${item.price}
                    </div>
                  )}

                  {item.excerpt && (
                    <p
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: "#666",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.excerpt.slice(0, 90)}...
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
