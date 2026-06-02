import { useState } from "react";
import Link from "next/link";

export default function Blog() {
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateArticle = async () => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });

      const data = await res.json();

      const newArticle = {
        id: Date.now().toString(),
        title: keyword,
        content: data?.article || "No content generated",
        slug: keyword
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, ""),
      };

      setArticles((prev) => [newArticle, ...prev]);
      setKeyword("");
    } catch (err) {
      console.error("Generate error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🔥 Auto Blog Generator</h1>

      <input
        placeholder="اكتب كلمة زي: best smart watch 2026"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          padding: 12,
          width: "100%",
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      <button
        onClick={generateArticle}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: 12,
          background: "#ff9900",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Generating..." : "✨ Generate Article"}
      </button>

      {articles.length === 0 && (
        <p style={{ marginTop: 20, color: "#666" }}>
          No articles yet
        </p>
      )}

      {articles.map((a) => (
        <div
          key={a.id}
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #eee",
            borderRadius: 10,
          }}
        >
          <h2>{a.title}</h2>

          <p style={{ color: "#666", fontSize: 13 }}>
            {a.content?.slice(0, 120)}...
          </p>

          <Link href={`/blog/${a.slug}`}>
            <button
              style={{
                marginTop: 10,
                padding: 10,
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              📖 Read
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
  }
