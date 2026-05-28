export default async function handler(req, res) {
  try {
    const { action } = req.query;

    if (action === "profit") {
      return res.json({ success: true, result: "profit data" });
    }

    if (action === "predict") {
      return res.json({ success: true, result: "predict data" });
    }

    if (action === "ranking") {
      return res.json({ success: true, result: "ranking data" });
    }

    return res.json({ success: true, message: "AI API working" });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
