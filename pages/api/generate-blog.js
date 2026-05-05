export default async function handler(req, res) {
  try {
    const { keyword } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
اكتب مقال SEO احترافي عن: ${keyword}

الشروط:
- عنوان جذاب
- مقدمة
- فقرات بعناوين H2
- نقاط Bullet
- خاتمة
- اسلوب تسويقي لبيع منتجات
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No article";

    res.status(200).json({ article: text });

  } catch (e) {
    res.status(500).json({ error: "AI Error" });
  }
}
