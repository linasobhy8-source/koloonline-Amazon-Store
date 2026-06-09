export default async function handler(req, res) {
  /* ================= METHOD CHECK ================= */
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    /* ================= API KEY CHECK ================= */
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Missing GEMINI_API_KEY",
      });
    }

    const title =
      typeof req.body?.title === "string"
        ? req.body.title.trim()
        : "";

    /* ================= VALIDATION ================= */
    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Missing product title",
      });
    }

    /* ================= PROMPT ================= */
    const prompt = `
اكتب وصفاً احترافياً لمنتج تجارة إلكترونية باللغة العربية.

اسم المنتج:
${title}

المطلوب:

1- وصف تسويقي احترافي (120-200 كلمة)
2- خمس مميزات رئيسية
3- أهم الاستخدامات
4- فقرة إقناعية قصيرة للشراء

شروط مهمة:
- أسلوب طبيعي
- متوافق مع SEO
- بدون مبالغة
- بدون كلمات سبام
- بدون تكرار
`;

    /* ================= GEMINI REQUEST ================= */
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    /* ================= RESPONSE VALIDATION ================= */
    if (!response.ok) {
      const errorText = await response.text();

      console.error("Gemini HTTP Error:", errorText);

      return res.status(500).json({
        success: false,
        error: "Gemini request failed",
      });
    }

    const data = await response.json();

    const description =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "";

    if (!description) {
      return res.status(500).json({
        success: false,
        error: "No description generated",
      });
    }

    /* ================= SUCCESS ================= */
    return res.status(200).json({
      success: true,
      title,
      description,
      generatedAt: Date.now(),
    });
  } catch (error) {
    console.error("GEMINI API ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown AI Error",
    });
  }
      }
