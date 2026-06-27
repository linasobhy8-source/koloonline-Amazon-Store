import {
  generateWhySection,
  generateHighlights,
  generateFAQ,
  generatePros,
  generateCons,
} from "@/lib/seo/aiContentEngine";

/* ================= PRODUCT SEO CONTENT BLOCKS ================= */
/* 🚀 SEO OPTIMIZED + AI CONTENT STRUCTURE */

export default function ProductSEOBlocks({ product }) {
  if (!product || typeof product !== "object") return null;

  const title = product.title || "This Product";

  const highlights = Array.isArray(generateHighlights(product))
    ? generateHighlights(product)
    : [];

  const faqs = Array.isArray(generateFAQ(product)) ? generateFAQ(product) : [];

  const pros = Array.isArray(generatePros(product)) ? generatePros(product) : [];

  const cons = Array.isArray(generateCons(product)) ? generateCons(product) : [];

  return (
    <section
      style={{
        background: "#ffffff",
        padding: 24,
        marginTop: 30,
        borderRadius: 12,
        border: "1px solid #eee",
      }}
    >

      {/* ================= WHY SECTION ================= */}
      <div style={{ marginBottom: 30 }}>
        <h2>🔥 Why People Love {title}</h2>

        <p style={{ lineHeight: 1.8, color: "#444" }}>
          {generateWhySection(product)}
        </p>
      </div>

      {/* ================= HIGHLIGHTS ================= */}
      <div style={{ marginBottom: 30 }}>
        <h2>⭐ Key Highlights</h2>

        <ul style={{ lineHeight: 2, paddingLeft: 18 }}>
          {highlights.map((item, i) => (
            <li key={i}>✔ {item}</li>
          ))}
        </ul>
      </div>

      {/* ================= PROS & CONS ================= */}
      <div style={{ marginBottom: 30 }}>
        <h2>⚖️ Pros & Cons Analysis</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >

          {/* PROS */}
          <div
            style={{
              background: "#f0fff4",
              padding: 18,
              borderRadius: 10,
              border: "1px solid #d4f5dc",
            }}
          >
            <h3>👍 Pros</h3>

            <ul style={{ lineHeight: 2, paddingLeft: 18 }}>
              {pros.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* CONS */}
          <div
            style={{
              background: "#fff5f5",
              padding: 18,
              borderRadius: 10,
              border: "1px solid #ffd6d6",
            }}
          >
            <h3>👎 Cons</h3>

            <ul style={{ lineHeight: 2, paddingLeft: 18 }}>
              {cons.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ================= FAQ ================= */}
      <div>
        <h2>❓ Frequently Asked Questions</h2>

        <div style={{ lineHeight: 1.8 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <h3 style={{ marginBottom: 5 }}>
                {f.q}
              </h3>

              <p style={{ color: "#555" }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
