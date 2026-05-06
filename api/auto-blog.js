export default async function handler(req, res) {
  try {
    const keywords = [
      "best amazon gadgets",
      "cheap smart watch",
      "home fitness equipment",
      "wireless earbuds review"
    ];

    const keyword =
      keywords[Math.floor(Math.random() * keywords.length)];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
اكتب مقال SEO احترافي عن: ${keyword}

- عنوان قوي
- مقدمة
- 5 عناوين H2
- نص تسويقي
- كلمات شراء
- خاتمة بيع
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const article =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    /* ================= SAVE TO FIREBASE ================= */
    const { db } = await import("../../config/firebase");
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");

    await addDoc(collection(db, "blog"), {
      title: keyword,
      content: article,
      createdAt: serverTimestamp(),
      auto: true,
    });

    res.json({ success: true, keyword });

  } catch (e) {
    res.status(500).json({ error: "auto blog failed" });
  }
}
