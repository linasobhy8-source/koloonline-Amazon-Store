export default async function handler(req, res) {
  /* ================= METHOD CHECK ================= */
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const { title } = req.body;

    /* ================= VALIDATION ================= */
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid title",
      });
    }

    /* ================= GEMINI REQUEST ================= */
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" +
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
اكتب وصف تسويقي احترافي لمنتج باللغة العربية بأسلوب جذاب ومقنع للمشتري.

الشروط:
- أسلوب طبيعي غير مبالغ فيه
- مناسب لمواقع التجارة الإلكترونية
- مناسب لتحسين SEO
- لا تستخدم كلمات spam أو تكرار مبالغ فيه

المنتج: ${title}

ثم اكتب:
- 5 مميزات واضحة
- استخدامات المنتج
- فقرة قصيرة إقناعية للشراء
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    /* ================= RESPONSE CHECK ================= */
    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No description generated";

    /* ================= FINAL RESPONSE ================= */
    return res.status(200).json({
      success: true,
      description: text,
    });

  } catch (error) {
    console.error("GEMINI API ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "AI Error occurred",
    });
  }
}
