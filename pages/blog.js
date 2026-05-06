import { useState } from "react";
import Link from "next/link";

export default function Blog() {
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);

  const generateArticle = async () => {
    const res = await fetch("/api/generate-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ keyword })
    });

    const data = await res.json();

    const newArticle = {
      id: Date.now(),
      title: keyword,
      content: data.article
    };

    setArticles([newArticle, ...articles]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 Auto Blog Generator</h1>

      <input
        placeholder="اكتب كلمة زي: best smart watch 2026"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: 10, width: "100%" }}
      />

      <button onClick={generateArticle} style={{ marginTop: 10 }}>
        ✨ Generate Article
      </button>

      {articles.map((a) => (
        <div key={a.id} style={{ marginTop: 20 }}>
          <h2>{a.title}</h2>
          <Link href={`/blog/${a.id}`}>
            <button>Read</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
