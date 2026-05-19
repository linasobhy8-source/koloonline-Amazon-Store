export default async function handler(req, res) {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Missing title" });
    }

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
                  text: `اكتب وصف تسويقي احترافي + نقاط مميزات لمنتج: ${title} باللغة العربية بشكل جذاب للبيع`
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No description";

    res.status(200).json({ description: text });
  } catch (error) {
    res.status(500).json({ error: "AI Error" });
  }
}
