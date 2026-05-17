import {
  generateWhySection,
  generateHighlights,
  generateFAQ,
  generatePros,
  generateCons,
} from "@/lib/seo/aiContentEngine";

export default function ProductSEOBlocks({ product }) {
  if (!product) return null;

  const highlights = generateHighlights(product);
  const faqs = generateFAQ(product);
  const pros = generatePros(product);
  const cons = generateCons(product);

  return (
    <section
      style={{
        background: "#fff",
        padding: 20,
        marginTop: 20,
        borderRadius: 12,
      }}
    >

      {/* WHY WE LOVE IT */}
      <div style={{ marginBottom: 30 }}>
        <h2>Why We Love It</h2>
        <p style={{ lineHeight: 1.8, color: "#444" }}>
          {generateWhySection(product)}
        </p>
      </div>

      {/* PRODUCT HIGHLIGHTS */}
      <div style={{ marginBottom: 30 }}>
        <h2>Product Highlights</h2>

        <ul style={{ lineHeight: 2, paddingLeft: 20 }}>
          {highlights.map((item, index) => (
            <li key={index}>✔ {item}</li>
          ))}
        </ul>
      </div>

      {/* PROS & CONS */}
      <div style={{ marginBottom: 30 }}>
        <h2>Pros & Cons</h2>

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
              background: "#f7fff7",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <h3>👍 Pros</h3>
            <ul style={{ lineHeight: 2, paddingLeft: 20 }}>
              {pros.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* CONS */}
          <div
            style={{
              background: "#fff8f8",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <h3>👎 Cons</h3>
            <ul style={{ lineHeight: 2, paddingLeft: 20 }}>
              {cons.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2>Frequently Asked Questions</h2>

        <div style={{ lineHeight: 1.9 }}>
          {faqs.map((f, index) => (
            <div key={index} style={{ marginBottom: 15 }}>
              <h3 style={{ marginBottom: 5 }}>{f.q}</h3>
              <p style={{ color: "#555" }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
