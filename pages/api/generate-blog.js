export default async function handler(req, res) {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "keyword is required" });
    }

    /* ================= GEMINI REQUEST ================= */
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
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
اكتب مقال SEO احترافي قوي جدًا عن: ${keyword}

الشروط:
- عنوان جذاب (H1)
- مقدمة قوية لا تقل عن 80 كلمة
- 5 عناوين H2 على الأقل
- كل H2 فيه شرح مفصل
- نقاط Bullet points
- أسلوب تسويقي مناسب للأفلييت
- إدخال كلمات شرائية (Buy intent keywords)
- خاتمة فيها دعوة للشراء
- المقال يكون 1000 كلمة تقريبًا
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    /* ================= SAFE PARSING ================= */
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({
        error: "Empty AI response",
      });
    }

    /* ================= RETURN ================= */
    return res.status(200).json({
      success: true,
      article: text,
      keyword,
    });

  } catch (e) {
    console.error("AI ERROR:", e);
    return res.status(500).json({
      error: "AI generation failed",
    });
  }
}
